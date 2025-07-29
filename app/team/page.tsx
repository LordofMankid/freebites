"use client";
import React from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/common/PageHeader";
import ImageSection, { ImageCardProps } from "../components/team/ImageSection";

const Founders: ImageCardProps[] = [
  { name: "sarah_jun", position: "Co-Founder" },
  { name: "clarence_yeh", position: "Co-Founder" },
];

const Developers: ImageCardProps[] = [
  { name: "clarence_yeh", position: "Tech Lead†" },
  { name: "johnny_tan", position: "Tech Lead†" },
  { name: "Anneka_Le", position: "Project Manager†" },
  { name: "sristi_panchu", position: "Project Manager†" },
  { name: "keiji_numata", position: "Tech Lead" },
  { name: "manuel_pena", position: "Tech Lead" },
  { name: "mina_shimada", position: "Project Manager" },
  { name: "owen_prendergast", position: "Developer" },
  { name: "vina_le", position: "Developer" },
  { name: "jet_yotsuuye", position: "Developer" },
  { name: "aarya_modi", position: "Developer" },
  { name: "lydia_chen", position: "Developer" },
  { name: "luis_suarez", position: "Developer" },
  { name: "tomas_maranga", position: "Developer" },
  { name: "natalie_phua", position: "Developer" },
  { name: "jack_zhang", position: "Developer†" },
];

const Marketers: ImageCardProps[] = [
  { name: "alice_fang", position: "Marketing Head†" },
  { name: "jack_zhang", position: "Marketing Head" },
  { name: "phoebe_yao", position: "Marketer" },
  { name: "michelle_tan", position: "Marketer" },
];

const Designers: ImageCardProps[] = [
  { name: "sarah_jun", position: "Lead Designer†" },
  { name: "alice_fang", position: "Lead Designer†" },
  { name: "sydnie_chen", position: " Lead Designer†" },
  { name: "ashley_wu", position: "Lead Designer†" },
  { name: "an_tran", position: "Designer" },
  { name: "rachel_liang", position: "Designer" },
];
// const GenTwoInfo: ImageCardProps[] = [
//   { name: "Sristi Panchu", position: "Project Manager†" },
//   { name: "Owen Prendergast", position: "Developer" },
//   { name: "Jet Yotsuuye", position: "Project Manager†" },
// ];

export default function page() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <PageHeader
        title="Meet the team"
        subtitle="We're proud to be entirely student run blah blah blah"
        altStyle="mt-16 lg:mt-32"
      />
      <ImageSection sectionTitle="Founders" imageCardInfo={Founders} />
      <ImageSection sectionTitle="Developer Team" imageCardInfo={Developers} />
      <ImageSection sectionTitle="Marketing Team" imageCardInfo={Marketers} />
      <ImageSection sectionTitle="Design Team" imageCardInfo={Designers} />
    </div>
  );
}
