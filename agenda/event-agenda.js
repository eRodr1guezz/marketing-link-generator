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
        startTime: new Date("Feb 19 2023 11:30"),
        endTime: new Date("Feb 19 2023 12:00"),
        speaker: [{
          firstName: "Blakely",
          lastName: "Jaishri",
          isFeatured: true,
          title: "MD, PhD.",
          img: "https://events.medscapelive.org/file_uploads/f5724a1f9f9fc78550f6137395a4c9f2_blakeley_jaishri.jpg",
        }],
      },
      {
        title: "Welcome and Introductions",
        subtitle: "",
        startTime: new Date("Feb 19 2023 12:00"),
        endTime: new Date("Feb 19 2023 12:50"),
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
        title: "Case 1: Lorem",
        subtitle: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
        topic: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
        startTime: new Date("Feb 19 2023 12:00"),
        endTime: new Date("Feb 19 2023 12:50"),
        speaker: [{
          firstName: "April",
          lastName: "Armstrong",
          isFeatured: true,
          title: "MD, MPH",
          img: "https://i.pravatar.cc/150?img=1",
        }],
      },
      {
        title: "Case 2: More lorem",
        subtitle: "Ipsum dolor, sit amet consectetur adipisicing elit.",
        topic:
          "Ipsum dolor, sit amet consectetur adipisicing elit. ipsum dolor, sit amet consectetur adipisicing elit. ipsum dolor, sit amet consectetur adipisicing elit.",
        startTime: new Date("Feb 19 2023 12:00"),
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
          "Case 3: Consectetur adipisicing elit",
        subtitle: "",
        topic: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque obcaecati, libero debitis dignissimos voluptatibus.",
        startTime: new Date("Feb 19 2023 12:00"),
        endTime: new Date("Feb 19 2023 12:50"),
        speaker: [{
          firstName: "Mark",
          lastName: "Lebwohl",
          title: "MD",
          img: "https://i.pravatar.cc/150?img=3",
        }],
      },
      {
        title: "Overlapping Test Session",
        subtitle: "",
        startTime: new Date("Feb 19 2023 12:30"),
        endTime: new Date("Feb 19 2023 13:30"),
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
        title: "Closing Remarks",
        subtitle: "",
        startTime: new Date("Feb 19 2023 12:50"),
        endTime: new Date("Feb 19 2023 12:55"),
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
        title: "Q&A",
        subtitle: "",
        startTime: new Date("Feb 19 2023 12:55"),
        endTime: new Date("Feb 19 2023 13:30"),
        speaker: [
          {
            firstName: "Melodie",
            lastName: "Young",
            isFeatured: false,
            title: "MSN, ANP-C",
            img: "https://i.pravatar.cc/150?img=2",
          },
          {
            firstName: "Mark",
            lastName: "Lebwohl",
            isFeatured: false,
            title: "MD",
            img: "https://i.pravatar.cc/150?img=3",
          },
        ],
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
        title: "Another Session Test Oye",
        subtitle: "",
        startTime: new Date("Feb 20 2023 12:50"),
        endTime: new Date("Feb 20 2023 12:55"),
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