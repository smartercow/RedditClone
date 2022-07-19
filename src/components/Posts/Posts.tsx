import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Community } from "../../atoms/communitiesAtom";
import { firestore } from "../../firebase/clientApp";

type PostsProps = {
  communityData: Community;
  //userId?: string
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  //useAuthState
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    try {

      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      console.log("posts", posts);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return <div>Posts</div>;
};
export default Posts;
