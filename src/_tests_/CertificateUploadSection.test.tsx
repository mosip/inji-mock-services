import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CertificateUploadingSection from '../components/CertificateUploadSection';
import { MemoryRouter } from 'react-router-dom';

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
  error: any = null;
  readyState = 0;
  DONE = FileReader.DONE;
  EMPTY = FileReader.EMPTY;
  LOADING = FileReader.LOADING;

  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onabort: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

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

  readAsText = jest.fn();
  readAsArrayBuffer = jest.fn();
  readAsBinaryString = jest.fn();
  abort = jest.fn();
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  dispatchEvent = jest.fn();
}

describe('CertificateUploadingSection', () => {
  const defaultProps = {
    showUploadingBlock: false,
    setShowUploadingBlock: jest.fn(),
    setFileUploaded: jest.fn(),
    errorMsg: '',
    setErrorMsg: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.FileReader = jest.fn(() => new FileReaderMock()) as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders initial upload UI', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadingSection {...defaultProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByAltText('upload cloud icon')).toBeInTheDocument();
      expect(screen.getByText('certificationUploadSec.cpc')).toBeInTheDocument();
      expect(screen.getByText('certificationUploadSec.clickToBrowse')).toBeInTheDocument();
      expect(screen.getByText('certificationUploadSec.uploadCertificateInfo')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('handles valid file upload and simulates progress', async () => {
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

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    expect(defaultProps.setShowUploadingBlock).toHaveBeenCalledWith(true);

    await waitFor(() => {
      console.log('Checking upload block...');
      screen.debug();
      const uploadBlock = screen.getByRole('region', { name: /upload block/i });
      expect(uploadBlock).toBeInTheDocument();
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    }, { timeout: 2000 });

    await act(async () => {
      jest.advanceTimersByTime(3000); // 5 intervals * 500ms + buffer
    });

    await waitFor(() => {
      console.log('Checking 100% progress...');
      screen.debug();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(defaultProps.setFileUploaded).toHaveBeenCalledWith(true);
    }, { timeout: 4000 });

    jest.useRealTimers();
  });

  test('shows error for unsupported file type', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadingSection {...defaultProps} />
      </MemoryRouter>
    );

    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('file-upload-input');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(defaultProps.setErrorMsg).toHaveBeenCalledWith('upload.error.unsupportedFileType');
    expect(defaultProps.setShowUploadingBlock).toHaveBeenCalledWith(true);

    await waitFor(() => {
      console.log('Checking error block...');
      screen.debug();
      const errorBlock = screen.getByRole('region', { name: /error block/i });
      expect(errorBlock).toBeInTheDocument();
      expect(screen.getByText('certificationUploadSec.failed')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('shows error for file size exceeding limit', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadingSection {...defaultProps} />
      </MemoryRouter>
    );

    const largeData = 'x'.repeat(6 * 1024 * 1024); // 6MB file
    const file = new File([largeData], 'large.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-upload-input');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(defaultProps.setErrorMsg).toHaveBeenCalledWith('upload.error.fileSizeExceeded');

    await waitFor(() => {
      console.log('Checking error block...');
      screen.debug();
      const errorBlock = screen.getByRole('region', { name: /error block/i });
      expect(errorBlock).toBeInTheDocument();
      expect(screen.getByText('certificationUploadSec.failed')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('cancels upload and resets state', async () => {
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

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const trashIcon = screen.getByAltText('trash icon');

    await act(async () => {
      fireEvent.click(trashIcon);
    });

    expect(defaultProps.setShowUploadingBlock).toHaveBeenCalledWith(false);
    expect(defaultProps.setFileUploaded).toHaveBeenCalledWith(false);

    await waitFor(() => {
      console.log('Checking reset state...');
      screen.debug();
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
      expect(screen.getByAltText('upload cloud icon')).toBeInTheDocument();
    }, { timeout: 2000 });

    jest.useRealTimers();
  });

  test('changes file and resets state', async () => {
    const mockProps = {
      ...defaultProps,
      showUploadingBlock: true,
    };

    render(
      <MemoryRouter>
        <CertificateUploadingSection {...mockProps} />
      </MemoryRouter>
    );

    // Simulate a file upload to set fileName, ensuring uploading block renders
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-upload-input');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      console.log('Checking change file button...');
      screen.debug();
      const changeButton = screen.getByText('certificationUploadSec.changeFile');
      expect(changeButton).toBeInTheDocument();
    }, { timeout: 2000 });

    const changeButton = screen.getByText('certificationUploadSec.changeFile');
    const fileInput = screen.getByTestId('file-upload-input');

    const clickSpy = jest.spyOn(fileInput, 'click').mockImplementation(() => {});

    await act(async () => {
      fireEvent.click(changeButton);
    });

    expect(mockProps.setShowUploadingBlock).toHaveBeenCalledWith(false);
    expect(mockProps.setFileUploaded).toHaveBeenCalledWith(false);
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });
});