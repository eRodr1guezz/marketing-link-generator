const testAgenda = [
  {
    title: "Future of Medical Dermatology: Part 1",
    id: 1,
    date: new Date("Feb 19 2023"),
    sessionChair: [{
      firstName: "Linda F.",
      lastName: "Stein Gold",
      isFeatured: true,
      title: "MD",
      img: "https://na-admin.eventscloud.com/image.php?acc=8388&id=1683320",
    },
    {
      firstName: "Lawrence F.",
      lastName: "Eichenfield",
      isFeatured: true,
      title: "MD",
      img: "https://na-admin.eventscloud.com/image.php?acc=8388&id=1561101",
    },
    {
      firstName: "Michael S.",
      lastName: "Kaminer",
      isFeatured: true,
      title: "MD",
      img: "https://na-admin.eventscloud.com/image.php?acc=8388&id=1567542",
    },
    {
      firstName: "Jacqueline D.",
      lastName: "Watchmaker",
      isFeatured: true,
      title: "MD",
      img: "https://na-admin.eventscloud.com/image.php?acc=8388&id=1728362",
    },

    ],
    sessions: [
      {
        title: "Atopic Dermatitis",
        subtitle: "",
        startTime: new Date("Feb 19 2023 7:00"),
        endTime: new Date("Feb 19 2023 8:30"),
        speaker: [{
          firstName: "Blakely",
          lastName: "Jaishri",
          isFeatured: true,
          title: "MD, PhD.",
          img: "https://events.medscapelive.org/file_uploads/f5724a1f9f9fc78550f6137395a4c9f2_blakeley_jaishri.jpg",
        }],
      },
      {
        title: "Rosacea",
        subtitle: "",
        startTime: new Date("Feb 19 2023 8:35"),
        endTime: new Date("Feb 19 2023 9:30"),
        topic:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque obcaecati, libero debitis dignissimos voluptatibus in ipsum veritatis soluta fugit consequatur delectus, nam est. Delectus!",
        speaker: [{
          firstName: "Blakely",
          lastName: "Jaishri",
          isFeatured: true,
          title: "MD, PhD.",
          img: "https://events.medscapelive.org/file_uploads/f5724a1f9f9fc78550f6137395a4c9f2_blakeley_jaishri.jpg",
        }],
      },
      {
        title: "Hyperhidrosis",
        subtitle: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
        topic: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
        startTime: new Date("Feb 19 2023 9:35"),
        endTime: new Date("Feb 19 2023 10:30"),
        speaker: [{
          firstName: "April",
          lastName: "Armstrong",
          isFeatured: true,
          title: "MD, MPH",
          img: "https://i.pravatar.cc/150?img=1",
        }],
      },
      {
        title: "Acne",
        subtitle: "Ipsum dolor, sit amet consectetur adipisicing elit.",
        topic:
          "Ipsum dolor, sit amet consectetur adipisicing elit. ipsum dolor, sit amet consectetur adipisicing elit. ipsum dolor, sit amet consectetur adipisicing elit.",
        startTime: new Date("Feb 19 2023 12:30"),
        endTime: new Date("Feb 19 2023 12:50"),
        speaker: [{
          firstName: "Melodie",
          lastName: "Young",
          title: "MSN, ANP-C",
          img: "https://i.pravatar.cc/150?img=2",
        }],
      },
      {
        title:
          "Vitiligo",
        subtitle: "",
        topic: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque obcaecati, libero debitis dignissimos voluptatibus.",
        startTime: new Date("Feb 19 2023 12:45"),
        endTime: new Date("Feb 19 2023 12:50"),
        speaker: [{
          firstName: "Mark",
          lastName: "Lebwohl",
          title: "MD",
          img: "https://i.pravatar.cc/150?img=3",
        }],
      },
    ],
  },
  {
    title: "Future of Medical Dermatology: Part 2",
    id: 2,
    date: new Date("Feb 20 2023"),
    sessionChair: [{
      firstName: "Blakely",
      lastName: "Jaishri",
      isFeatured: true,
      title: "MD, PhD.",
      img: "https://events.medscapelive.org/file_uploads/f5724a1f9f9fc78550f6137395a4c9f2_blakeley_jaishri.jpg",
    }],
    sessions: [
      {
        title: "Psoriasis",
        subtitle: "",
        startTime: new Date("Feb 20 2023 7:00"),
        endTime: new Date("Feb 20 2023 8:00"),
        topic:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque obcaecati, libero debitis dignissimos voluptatibus in ipsum veritatis soluta fugit consequatur delectus, nam est. Delectus!",
        speaker: [{
          firstName: "April",
          lastName: "Armstrong",
          isFeatured: true,
          title: "MD, MPH",
          img: "https://i.pravatar.cc/150?img=1",
        }],
      },
      {
        title: "Scar & Keloids",
        subtitle: "",
        startTime: new Date("Feb 20 2023 7:00"),
        endTime: new Date("Feb 20 2023 8:00"),
        topic:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque obcaecati, libero debitis dignissimos voluptatibus in ipsum veritatis soluta fugit consequatur delectus, nam est. Delectus!",
        speaker: [{
          firstName: "April",
          lastName: "Armstrong",
          isFeatured: true,
          title: "MD, MPH",
          img: "https://i.pravatar.cc/150?img=1",
        }],
      },
      {
        title: "Hidradenitis Suppurativas",
        subtitle: "",
        startTime: new Date("Feb 20 2023 7:00"),
        endTime: new Date("Feb 20 2023 8:00"),
        topic:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque obcaecati, libero debitis dignissimos voluptatibus in ipsum veritatis soluta fugit consequatur delectus, nam est. Delectus!",
        speaker: [{
          firstName: "April",
          lastName: "Armstrong",
          isFeatured: true,
          title: "MD, MPH",
          img: "https://i.pravatar.cc/150?img=1",
        }],
      },
      {
        title: "Psoriasis",
        subtitle: "",
        startTime: new Date("Feb 20 2023 7:00"),
        endTime: new Date("Feb 20 2023 8:00"),
        topic:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque obcaecati, libero debitis dignissimos voluptatibus in ipsum veritatis soluta fugit consequatur delectus, nam est. Delectus!",
        speaker: [{
          firstName: "April",
          lastName: "Armstrong",
          isFeatured: true,
          title: "MD, MPH",
          img: "https://i.pravatar.cc/150?img=1",
        }],
      },
      {
        title: "Psoriasis",
        subtitle: "",
        startTime: new Date("Feb 20 2023 7:00"),
        endTime: new Date("Feb 20 2023 8:00"),
        topic:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque obcaecati, libero debitis dignissimos voluptatibus in ipsum veritatis soluta fugit consequatur delectus, nam est. Delectus!",
        speaker: [{
          firstName: "April",
          lastName: "Armstrong",
          isFeatured: true,
          title: "MD, MPH",
          img: "https://i.pravatar.cc/150?img=1",
        }],
      },
    ]
  },
  {
    title: "Day 3: Changing The Landscape in Dermatology Part 3 - Revenge of the Zit",
    id: 3,
    date: new Date("Feb 21 2023"),
    sessionChair: [{
      firstName: "Blakely",
      lastName: "Jaishri",
      isFeatured: true,
      title: "MD, PhD.",
      img: "https://events.medscapelive.org/file_uploads/f5724a1f9f9fc78550f6137395a4c9f2_blakeley_jaishri.jpg",
    }],
    sessions: [
      {
        title: "A Third Day? Are You Crazy?? What Is This Costing Us!?",
        subtitle: "Blah blah blah",
        startTime: new Date("Feb 21 2023 12:50"),
        endTime: new Date("Feb 21 2023 12:55"),
        topic:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque obcaecati, libero debitis dignissimos voluptatibus in ipsum veritatis soluta fugit consequatur delectus, nam est. Delectus!",
        speaker: [{
          firstName: "April",
          lastName: "Armstrong",
          isFeatured: true,
          title: "MD, MPH",
          img: "https://i.pravatar.cc/150?img=1",
        }],
      },
    ]
  }
];