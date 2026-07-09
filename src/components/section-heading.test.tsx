import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renders title, eyebrow and description", () => {
    render(<SectionHeading eyebrow="Live" title="Crowd Flow" description="Right now" />);
    expect(screen.getByRole("heading", { name: "Crowd Flow" })).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Right now")).toBeInTheDocument();
  });
  it("omits the eyebrow when not provided", () => {
    render(<SectionHeading title="Only Title" />);
    expect(screen.queryByText("Live")).not.toBeInTheDocument();
  });
});
