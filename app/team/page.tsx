"use client";
import React from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/common/PageHeader";
import ImageSection, { ImageCardProps } from "../components/team/ImageSection";

const imageCardInfo: ImageCardProps[] = [
  // { src: Logo, name: "clcok", position: "clcock" },
  { name: "clcok", position: "clcock" },
  { name: "clcok", position: "clcock" },
  { name: "clcok", position: "clcock" },
];

export default function page() {
  return (
    <div>
      <Navbar />
      <PageHeader
        title="Meet the team"
        subtitle="We're proud to be entirely student run blah blah blah"
        altStyle="mt-12"
      />
      <ImageSection sectionTitle="Alumni" imageCardInfo={imageCardInfo} />
    </div>
  );
}
