export interface Service {
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    title: "Land Brokerage & Sales",
    description: "Expert representation for buyers and sellers of rural and urban land across the Triangle region. We navigate every detail from soil evaluation to closing.",
    icon: "handshake",
  },
  {
    title: "Appraisal Services",
    description: "Professional property valuation backed by decades of local market knowledge. Accurate assessments for estates, transactions, and investment planning.",
    icon: "clipboard",
  },
  {
    title: "Land Planning & Development",
    description: "Concept plan development for residential and commercial projects. Access to our local builder, developer, and contractor networks.",
    icon: "map",
  },
  {
    title: "Estate Sales & Planning",
    description: "Comprehensive assistance with estate-related land transactions and strategic planning. Sensitive, experienced guidance through complex situations.",
    icon: "scroll",
  },
  {
    title: "1031 Exchanges",
    description: "Strategic tax-deferred exchange guidance to help you reinvest proceeds from land sales into new investment properties.",
    icon: "arrows",
  },
  {
    title: "Timber Management",
    description: "Expert evaluation and management of timber resources. Maximize the value of your wooded acreage with sustainable harvesting strategies.",
    icon: "trees",
  },
];
