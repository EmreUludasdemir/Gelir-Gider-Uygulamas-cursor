import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("başlık ve değeri gösterir", () => {
    render(<StatCard label="Toplam Gider" value="₺1.000" />);
    expect(screen.getByText("Toplam Gider")).toBeInTheDocument();
    expect(screen.getByText("₺1.000")).toBeInTheDocument();
  });
});


