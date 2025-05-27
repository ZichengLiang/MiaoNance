import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VaultDialog from "../vaultDialog";
import React from "react";
import { NotebookMetadata } from "@/types/notebook_metadata";

/* 
  Currently there are 6 tests for vaultDialog component in this file: 
  1. It renders edit dialog correctly
  2. It renders delete dialog correctly
  3. It handles edit submission correctly
  4. It handles delete submission correctly
  5. It shows error message when delete title does not match
  6. It closes dialog when cancel button is clicked
  use `npm run test` to run the test
*/

// Mock notebook data
const mockNotebook: NotebookMetadata = {
  uuid: "1",
  title: "Test Notebook",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock handlers
const mockHandleEdit = jest.fn();
const mockHandleDelete = jest.fn();
const mockSetIsOpen = jest.fn();

describe("VaultDialog", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders edit dialog correctly", () => {
    render(
      <VaultDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        notebook={mockNotebook}
        variant="edit"
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
      />
    );

    // Check if dialog title is correct
    expect(screen.getByText("Rename Notebook")).toBeInTheDocument();

    // Check if input field is present
    expect(screen.getByText("New Notebook Title")).toBeInTheDocument();

    // Check if buttons are present
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("renders delete dialog correctly", () => {
    render(
      <VaultDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        notebook={mockNotebook}
        variant="delete"
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
      />
    );

    // Check if dialog title is correct
    expect(screen.getByText("Delete Notebook")).toBeInTheDocument();

    // Check if warning text is present
    expect(
      screen.getByText(/Please type in the notebook title/)
    ).toBeInTheDocument();
    expect(screen.getByText(mockNotebook.title)).toBeInTheDocument();

    // Check if input field is present
    expect(screen.getByText("Notebook Title")).toBeInTheDocument();
  });

  it("handles edit submission correctly", () => {
    render(
      <VaultDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        notebook={mockNotebook}
        variant="edit"
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
      />
    );

    // Fill in the new title
    const input = screen.getByTestId("content-input");
    fireEvent.change(input, { target: { value: "New Title" } });

    // Submit the form
    const form = screen.getByRole("dialog");
    fireEvent.submit(form);

    // Check if handleEdit was called with correct parameters
    expect(mockHandleEdit).toHaveBeenCalledWith(mockNotebook, "New Title");
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it("handles delete submission correctly when title matches", () => {
    mockHandleDelete.mockReturnValue(true);

    render(
      <VaultDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        notebook={mockNotebook}
        variant="delete"
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
      />
    );

    // Fill in the matching title
    const input = screen.getByTestId("content-input");
    fireEvent.change(input, { target: { value: mockNotebook.title } });

    // Submit the form
    const form = screen.getByRole("dialog");
    fireEvent.submit(form);

    // Check if handleDelete was called with correct parameters
    expect(mockHandleDelete).toHaveBeenCalledWith(
      mockNotebook,
      mockNotebook.title
    );
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it("shows error message when delete title does not match", () => {
    mockHandleDelete.mockReturnValue(false);

    render(
      <VaultDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        notebook={mockNotebook}
        variant="delete"
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
      />
    );

    // Fill in the wrong title
    const input = screen.getByTestId("content-input");
    fireEvent.change(input, { target: { value: "Wrong Title" } });

    // Submit the form
    const form = screen.getByRole("dialog");
    fireEvent.submit(form);

    // Check if error message is shown
    expect(screen.getByText(/The title doesn't match/)).toBeInTheDocument();
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  it("closes dialog when cancel button is clicked", () => {
    render(
      <VaultDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        notebook={mockNotebook}
        variant="edit"
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
      />
    );

    // Click cancel button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Check if setIsOpen was called with false
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
});
