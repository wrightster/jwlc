export interface Testimonial {
  quote: string;
  author: string;
  context?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Julie, we got the check yesterday... thank you so much for hanging in there so long!",
    author: "A.W. and Mary Lee Stuart",
  },
  {
    quote: "I love you so much right now! Seriously, this was one of those projects that didn't seem to go right.",
    author: "Greg Platt",
  },
  {
    quote: "In the last thirty years, Julie Wright Land Company helped me invest in North Carolina — even after I moved to California 18 years ago.",
    author: "Lin Su Peng",
  },
  {
    quote: "Julie has gone above and beyond to help me with my farm property. The commission check does not reflect how much effort was spent.",
    author: "Mitzie Garland",
  },
  {
    quote: "Julie and her organization helped me to plan it, work through the various county regulatory bodies and find a surveyor.",
    author: "Roger McCall, RJMcCall LLC",
  },
  {
    quote: "Julie Wright Land Company is comprehensive and thorough. The agents have worked with our family over the years to find properties that were right for us.",
    author: "Roxie Lee",
  },
  {
    quote: "I highly recommend Julie as an honest, well-informed representative who oversees the seller's interests, yet also takes care to honestly help the buyer.",
    author: "Janet Johnson",
  },
];
