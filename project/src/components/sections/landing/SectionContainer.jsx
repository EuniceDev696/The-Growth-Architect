import React from "react";

function SectionContainer({ id, className = "", children }) {
  return (
    <section id={id} className={className}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export default SectionContainer;
