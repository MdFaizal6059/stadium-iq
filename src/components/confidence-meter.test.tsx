import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfidenceMeter } from "./confidence-meter";

describe("ConfidenceMeter", () => {
  it("renders the confidence percentage and progressbar ARIA attributes", () => {
    render(<ConfidenceMeter value={0.82} />);
    expect(screen.getByText("82%")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "82");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });
  it("clamps values above 1 and below 0", () => {
    const { rerender } = render(<ConfidenceMeter value={5} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
    rerender(<ConfidenceMeter value={-3} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
