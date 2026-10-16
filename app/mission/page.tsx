"use client";
import Initiative from "../components/common/Initiative";
import PageHeader from "../components/common/PageHeader";
import Navbar from "../components/Navbar";
import teamPhoto from "../../public/images/team-photo.jpg";
import Image from "next/image";

const missionStatement =
  "Freebites minimizes environmental food waste by connecting college students with surplus food from campus events before it is thrown away.";

export default function page() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <PageHeader
        title="Our Mission"
        subtitle={missionStatement}
        altStyle="mt-20"
      />
      <div className="px-20">
        <div className=" mt-10">
          <p className="font-baloo font-bold text-3xl mb-4"> How it works </p>
          <div className="flex flex-row gap-10">
            <div className="w-1/2">
              <p className="font-inter text-neutral-light-text font-normal text-base ssm:text-md md:text-lg lg:text-xl">
                <span className="text-orange-dark">Freebites, 501(c)(3)</span>
                operates a digital logistics platform designed to optimize
                surplus resource distribution. We provide a centralized platform
                where event hosts, university departments, and student
                organizations can instantly post extra, unconsumed food. Local
                students receive real-time notifications, allowing them to
                quickly retrieve and consume the food, keeping high-quality food
                out of landfills.
              </p>
            </div>
            <div className="relative w-1/2 overflow-hidden rounded-[20px]">
              <Image
                src={teamPhoto}
                alt="Freebites team photo"
                fill
                sizes="50vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>
          <div className="mt-10">
            {/* TODO: add in donation component from home page ticket */}
            <p> Insert donation component here (from home page ticket) </p>
          </div>
          <div className="mt-20">
            <p className="font-baloo font-bold text-3xl mb-4">
              Our Initiatives
            </p>
            <div className="w-1/2">
              <Initiative
                title="The Enhanced Digital Surplus Discovery Project"
                description="This program accelerates the extraction of surplus food from campus events through an advanced pre-scheduling feature on our digital platform. By allowing student organizations and university departments to log catering timelines ahead of schedule, we establish a proactive logistics window that minimizes the transition time from event conclusion to consumption, optimizing food safety and waste reduction."
                color="#F4FBE9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TODO: add in footer from home page ticket */}
    </div>
  );
}
