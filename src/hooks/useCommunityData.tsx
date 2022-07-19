import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { AuthModalState } from "../atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(AuthModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    //Is the user is signed in? - If not => open auth modal
    if (!user) {
      //open modal
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    //setLoading(true)
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }

    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      //get users snippets
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
      //console.log('Snippets',snippets);
    } catch (error: any) {
      console.log("getMySnippets error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    //Batch write
    try {
      setLoading(true);
      const batch = writeBatch(firestore);

      //Creating a new community snippet (for user)
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
      };

      //Updating the numbers of members (+1)
      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippet`, communityData.id),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOmembers: increment(1),
      });

      await batch.commit();

      //update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
      setLoading(false);
    } catch (error: any) {
      console.log("joinCommunity error", error);
      setError(error.message);
    }
  };

  const leaveCommunity = async (communityId: string) => {
    //Batch write
    try {
      setLoading(true);
      const batch = writeBatch(firestore);
      //- Deleting the community snippet (from user)
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippet`, communityId)
      );

      //- Updating the numbers of members (-1)
      batch.update(doc(firestore, "communities", communityId), {
        numberOmembers: increment(-1),
      });

      await batch.commit();
      //update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
      setLoading(false);
    } catch (error: any) {
      console.log("leaveCommunity", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  return {
    //returns data & functions - the stuff returned is what will be accesible by the other components that use this hook
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
