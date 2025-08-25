import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CertificateUploadingSection from '../components/CertificateUploadSection';
import { MemoryRouter } from 'react-router-dom';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock image imports
jest.mock('../assets/upload_cloud_icon.png', () => 'mocked-upload-cloud-icon');
jest.mock('../assets/file_type_icon.png', () => 'mocked-file-type-icon');
jest.mock('../assets/cross_circle_icon.png', () => 'mocked-cross-circle-icon');
jest.mock('../assets/trash_icon.png', () => 'mocked-trash-icon');

// Mock FileReader
class FileReaderMock {
  result: string | null = null;
  readyState = 0;
  DONE = FileReader.DONE;
  EMPTY = FileReader.EMPTY;
  LOADING = FileReader.LOADING;

  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

  readAsDataURL = jest.fn().mockImplementation((file: File) => {
    this.readyState = 1; // LOADING
    setTimeout(() => {
      this.result = `data:${file.type};base64,mocked-base64-content`;
      this.readyState = 2; // DONE
      if (this.onload) {
        this.onload({
          target: this,
          loaded: file.size,
          total: file.size,
        } as any);
      }
    }, 10);
  });
}

describe('CertificateUploadingSection', () => {
  const defaultProps = {
    showUploadingBlock: false,
    setShowUploadingBlock: jest.fn(),
    setFileUploaded: jest.fn(),
    setDataInFile: jest.fn(),
    cpcUploadErrorMsg: '',
    setCpcUploadErrorMsg: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.FileReader = jest.fn(() => new FileReaderMock()) as any;
  });

  test('renders initial upload UI', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadingSection {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByAltText('upload cloud icon')).toBeInTheDocument();
    expect(screen.getByText('certificationUploadSec.cpc')).toBeInTheDocument();
    expect(screen.getByText('certificationUploadSec.clickToBrowse')).toBeInTheDocument();
  });

  test('accepts valid PDF file and simulates progress', async () => {
    jest.useFakeTimers();

    render(
      <MemoryRouter>
        <CertificateUploadingSection {...defaultProps} />
      </MemoryRouter>
    );

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-upload-input');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(defaultProps.setShowUploadingBlock).toHaveBeenCalledWith(true);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(defaultProps.setFileUploaded).toHaveBeenCalledWith(true);
    });

    jest.useRealTimers();
  });

  test('rejects unsupported file type', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadingSection {...defaultProps} />
      </MemoryRouter>
    );

    const file = new File(['bad content'], 'bad.exe', { type: 'application/x-msdownload' });
    const input = screen.getByTestId('file-upload-input');

    fireEvent.change(input, { target: { files: [file] } });

    expect(defaultProps.setCpcUploadErrorMsg).toHaveBeenCalledWith('errors.uploadingCertificateErr');
  });

  test('shows error when file size exceeds limit', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadingSection {...defaultProps} />
      </MemoryRouter>
    );

    const largeData = 'x'.repeat(6 * 1024 * 1024); // 6MB
    const file = new File([largeData], 'large.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-upload-input');

    fireEvent.change(input, { target: { files: [file] } });

    expect(defaultProps.setCpcUploadErrorMsg).toHaveBeenCalledWith('upload.error.fileSizeExceeded');
  });

  test('cancels upload and resets state', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadingSection {...defaultProps} showUploadingBlock={true} />
      </MemoryRouter>
    );

    const trashIcon = screen.getByAltText('trash icon');
    fireEvent.click(trashIcon);

    expect(defaultProps.setFileUploaded).toHaveBeenCalledWith(false);
    expect(defaultProps.setShowUploadingBlock).toHaveBeenCalledWith(false);
    expect(defaultProps.setCpcUploadErrorMsg).toHaveBeenCalledWith('');
    expect(defaultProps.setDataInFile).toHaveBeenCalledWith(null);
  });

  test('changes file and resets state', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadingSection {...defaultProps} showUploadingBlock={true} />
      </MemoryRouter>
    );

    const changeButton = screen.getByTestId('change-file-button');
    fireEvent.click(changeButton);

    expect(defaultProps.setShowUploadingBlock).toHaveBeenCalledWith(false);
    expect(defaultProps.setFileUploaded).toHaveBeenCalledWith(false);
    expect(defaultProps.setDataInFile).toHaveBeenCalledWith(null);
    expect(defaultProps.setCpcUploadErrorMsg).toHaveBeenCalledWith('');
  });
});
