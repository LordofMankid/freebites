"use client";
import React from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/common/PageHeader";
import ImageSection, { ImageCardProps } from "../components/team/ImageSection";

const Leadership: ImageCardProps[] = [
  { name: "Sarah Jun", position: "Co-Founder" },
  { name: "Clarence Yeh", position: "Co-Founder, Tech Lead†" },
  { name: "Sydnie Chen", position: "Lead Designer†" },
  { name: "Alice Fang", position: "Marketing Head†, Lead Designer†" },
  { name: "Johnny Tan", position: "Tech Lead†" },
  { name: "Keiji Numata", position: "Tech Lead" },
  { name: "Johnny Tan", position: "Tech Lead" },
  { name: "Anneka Le", position: "Project Manager†" },
];

// const GenTwoInfo: ImageCardProps[] = [
//   { name: "Sristi Panchu", position: "Project Manager†" },
//   { name: "Owen Prendergast", position: "Developer" },
//   { name: "Jet Yotsuuye", position: "Project Manager†" },
// ];

export default function page() {
  return (
    <div>
      <Navbar />
      <PageHeader
        title="Meet the team"
        subtitle="We're proud to be entirely student run blah blah blah"
        altStyle="mt-12"
      />
      <ImageSection sectionTitle="Leadership" imageCardInfo={Leadership} />
    </div>
  );
}
