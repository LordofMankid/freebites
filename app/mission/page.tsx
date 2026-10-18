"use client";
import Initiative from "../components/common/Initiative";
import PageHeader from "../components/common/PageHeader";
import Navbar from "../components/Navbar";
import teamPhoto from "../../public/images/team-photo.jpg";
import Image from "next/image";
import DonationPrompt from "../components/DonationPrompt";

const missionStatement =
  "Freebites minimizes environmental food waste by connecting college students with surplus food from campus events before it is thrown away.";

const initiatives = [
  {
    title: "The Enhanced Digital Surplus Discovery Project",
    description:
      "This program accelerates the extraction of surplus food from campus events through an advanced pre-scheduling feature on our digital platform. By allowing student organizations and university departments to log catering timelines ahead of schedule, we establish a proactive logistics window that minimizes the transition time from event conclusion to consumption, optimizing food safety and waste reduction.",
    images: ["/assets/schedule post.svg"],
    color: "#F4FBE9",
  },
  {
    title: "The Food Security & Sustainability Digital Resource Network",
    description:
      "We deploy educational curriculum and resource toolkits across Instagram and LinkedIn to combat food waste and structural food insecurity. This dual-pronged digital strategy provides low-income students with actionable preservation tactics, while simultaneously educating the broader student body on the environmental consequences of retail and consumer waste.",
    images: ["/assets/resource guide.svg", "/assets/food options.svg"],
    color: "#FCE8EC",
  },
  {
    title: "The Inter-Organizational Waste Alleviation Campaign",
    description:
      "Our representatives lead community-wide outreach by tabling at diverse student organizational events to integrate waste reduction into general campus life. We provide student leaders with practical frameworks detailing how utilizing Freebites directly alleviates campus environmental footprints and stretches resource budgets.",
    images: ["/images/community day.svg"],
    color: "#D8E2FD",
  },
  {
    title: "Institutional Departmental Food Recovery Operations",
    description:
      "This initiative focuses on structural B2B outreach across administrative departments and student groups to systematically onboard their culinary surpluses. By embedding our application into standard post-event cleanup protocols, we transition campus departments from legacy disposal methods to institutionalized circular redistribution.",
    color: "#FFF5EB",
  },
  {
    title: "The Campus Public Fridge Redistribution Partnership",
    description:
      "We collaborate directly with existing campus sustainability networks and communal public fridges to maximize the life cycle of perishable goods. By cross-listing public fridge inventory live on the Freebites application, we prevent localized disposal bottlenecks and ensure community-source food is visible and accessible to food-insecure populations.",
    color: "#FFF5EB",
  },
];

export default function page() {
  const cardWeight = (item: { images?: unknown[] }) =>
    item.images && item.images.length > 0 ? 3 : 1;

  // Put each card in whatever col is shorter so far
  const columns: (typeof initiatives)[] = [[], []];
  const heights = [0, 0];

  initiatives.forEach((item) => {
    const col = heights[0] <= heights[1] ? 0 : 1;
    columns[col].push(item);
    heights[col] += cardWeight(item);
  });

  return (
    <div className="flex flex-col">
      <Navbar />
      <PageHeader
        title="Our Mission"
        subtitle={missionStatement}
        altStyle="mt-20"
      />
      <div className="px-4 md:px-20">
        <div className=" mt-10">
          <p className="font-baloo font-bold text-4xl mb-4"> How it works </p>
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
          {/* TODO: uncomment once donation link is ready */}
          {/* <div className="mt-20">
            <DonationPrompt />
          </div> */}
          <div className="mt-20">
            <p className="font-baloo font-bold text-4xl mb-4">
              Our Initiatives
            </p>
            <div className="flex flex-col min-[800px]:flex-row gap-6 items-start">
              {columns.map((column, c) => (
                <div
                  key={c}
                  className="flex flex-col gap-6 w-full min-[800px]:flex-1"
                >
                  {column.map((item) => (
                    <Initiative key={item.title} {...item} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TODO: add in footer from home page ticket */}
    </div>
  );
}
