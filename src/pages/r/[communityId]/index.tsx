import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Community } from "../../../atoms/communitiesAtom";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "../../../components/Community/NotFound";
import Header from "../../../components/Community/Header";
import PageContent from "../../../components/Layout/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Posts from "../../../components/Posts/Posts";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPageProps: React.FC<CommunityPageProps> = ({
  communityData,
}) => {
  console.log("Community", communityData);

  if (!communityData) {
    return (
      <div>
        <NotFound />
      </div>
    );
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        {/* Left side */}
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        {/* Right side */}
        <>
          <div>Right side</div>
        </>
        
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //Get community data and pass it to client
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      },
    };
  } catch (error) {
    //Could add error page here
    return { props: { error: "getServerSideProps error" } };
  }
}

export default CommunityPageProps;
