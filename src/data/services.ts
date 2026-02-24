export interface Service {
  title: string;
  description: string;
  icon: string;
  photo: string;
}

export const services: Service[] = [
  {
    title: "Land Brokerage & Sales",
    description: "Expert representation for buyers and sellers of rural and urban land across the Triangle region. We navigate every detail from soil evaluation to closing.",
    icon: "handshake",
    photo: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&h=400",
  },
  {
    title: "Appraisal Services",
    description: "Professional property valuation backed by decades of local market knowledge. Accurate assessments for estates, transactions, and investment planning.",
    icon: "clipboard",
    photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=400",
  },
  {
    title: "Land Planning & Development",
    description: "Concept plan development for residential and commercial projects. Access to our local builder, developer, and contractor networks.",
    icon: "map",
    photo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&h=400",
  },
  {
    title: "Estate Sales & Planning",
    description: "Comprehensive assistance with estate-related land transactions and strategic planning. Sensitive, experienced guidance through complex situations.",
    icon: "scroll",
    photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&h=400",
  },
  {
    title: "1031 Exchanges",
    description: "Strategic tax-deferred exchange guidance to help you reinvest proceeds from land sales into new investment properties.",
    icon: "arrows",
    photo: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=800&h=400",
  },
  {
    title: "Timber Management",
    description: "Expert evaluation and management of timber resources. Maximize the value of your wooded acreage with sustainable harvesting strategies.",
    icon: "trees",
    photo: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&h=400",
  },
];
