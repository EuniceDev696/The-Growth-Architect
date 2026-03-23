import React from "react";
import SectionContainer from "./SectionContainer";

function TestimonialsSection({ testimonials }) {
  return (
    <SectionContainer id="testimonials" className="bg-[#F8FAFC] py-14 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Client Proof</p>
        <h2 className="mt-3 font-heading text-3xl text-slate-900 sm:text-4xl">Trusted by founders and executive operators</h2>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.45)]"
          >
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                alt={`${testimonial.name} portrait`}
                className="h-14 w-14 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-base font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-500">
                  {testimonial.title}, {testimonial.company}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-700 sm:text-base">{testimonial.quote}</p>
            <p className="mt-4 text-sm font-semibold text-slate-900 sm:text-base">{testimonial.highlight}</p>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}

export default TestimonialsSection;
