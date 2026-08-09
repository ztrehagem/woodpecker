import React from "react";
import { useParams } from "react-router";

export function Page(): React.ReactElement {
  const { uri } = useParams<{ uri: string }>();

  return <div>Post: {uri}</div>;
}
