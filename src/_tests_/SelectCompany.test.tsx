import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SelectCompany from "./SelectCompany";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getCompanies } from "../api/companyApi";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../api/companyApi");

describe("SelectCompany Component - Full Coverage", () => {
  const mockNavigate = jest.fn();
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  const mockCompanies = [
    { id: 1, name: "Alpha Logistics" },
    { id: 2, name: "Beta Transport" },
    { id: 3, name: "Gamma Movers" },
  ];

  it("renders and matches snapshot", async () => {
    (getCompanies as jest.Mock).mockResolvedValue(mockCompanies);
    const { asFragment } = render(<SelectCompany />);
    await waitFor(() => screen.getByText("Alpha Logistics"));
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays loading state before data fetch", () => {
    (getCompanies as jest.Mock).mockResolvedValue([]);
    render(<SelectCompany />);
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("renders list of companies from API", async () => {
    (getCompanies as jest.Mock).mockResolvedValue(mockCompanies);
    render(<SelectCompany />);
    await waitFor(() => screen.getByText("Alpha Logistics"));
    expect(screen.getByText("Beta Transport")).toBeInTheDocument();
    expect(screen.getByText("Gamma Movers")).toBeInTheDocument();
  });

  it("filters companies based on search input", async () => {
    (getCompanies as jest.Mock).mockResolvedValue(mockCompanies);
    render(<SelectCompany />);
    await waitFor(() => screen.getByText("Alpha Logistics"));

    const searchInput = screen.getByPlaceholderText("searchCompany");
    fireEvent.change(searchInput, { target: { value: "Beta" } });

    expect(screen.getByText("Beta Transport")).toBeInTheDocument();
    expect(screen.queryByText("Alpha Logistics")).not.toBeInTheDocument();
  });

  it("selects a company when clicked", async () => {
    (getCompanies as jest.Mock).mockResolvedValue(mockCompanies);
    render(<SelectCompany />);
    await waitFor(() => screen.getByText("Alpha Logistics"));

    fireEvent.click(screen.getByText("Gamma Movers"));
    expect(screen.getByText("Gamma Movers")).toHaveClass("selected");
  });

  it("continue button is disabled until a company is selected", async () => {
    (getCompanies as jest.Mock).mockResolvedValue(mockCompanies);
    render(<SelectCompany />);
    await waitFor(() => screen.getByText("Alpha Logistics"));

    const continueBtn = screen.getByText("continue");
    expect(continueBtn).toBeDisabled();

    fireEvent.click(screen.getByText("Beta Transport"));
    expect(continueBtn).not.toBeDisabled();
  });

  it("navigates to next page on continue with selected company", async () => {
    (getCompanies as jest.Mock).mockResolvedValue(mockCompanies);
    render(<SelectCompany />);
    await waitFor(() => screen.getByText("Alpha Logistics"));

    fireEvent.click(screen.getByText("Alpha Logistics"));
    fireEvent.click(screen.getByText("continue"));

    expect(mockNavigate).toHaveBeenCalledWith("/company/1");
  });

  it("handles API error gracefully", async () => {
    (getCompanies as jest.Mock).mockRejectedValue(new Error("API Error"));
    render(<SelectCompany />);
    await waitFor(() => screen.getByText("errorLoadingCompanies"));
    expect(screen.getByText("errorLoadingCompanies")).toBeInTheDocument();
  });
});
