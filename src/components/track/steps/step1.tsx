'use client'
import { useDropzone, FileWithPath } from 'react-dropzone';
import './theme.css'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useCallback, useState } from 'react';
import { sendRequest, sendRequestFile } from '@/utils/api';
import { useSession } from "next-auth/react"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function InputFileUpload() {
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onClick={(e) => e.preventDefault()}
        >
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}

interface IProps {
    setValue: (v: number) => void;
    setTrackUpload: any;
    trackUpload: any;

}

const Step1 = (props: IProps) => {
    const { trackUpload } = props

    const [openMessage, setOpenMessage] = useState<boolean>(false)
    const [resMessage, setResMessage] = useState<string>('')

    const { data: session } = useSession()

    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        // Do something with the files
        if (acceptedFiles && acceptedFiles[0]) {
            props.setValue(1)

            const audio = acceptedFiles[0]

            const formData = new FormData();
            formData.append('fileUpload', audio);

            // const chills = await sendRequestFile<IBackendRes<ITrackTop[]>>({
            //     url: 'http://localhost:8000/api/v1/files/upload',
            //     method: 'POST',
            //     body: formData,
            //     headers: {
            //         'Authorization': `Bearer ${session?.access_token}`,
            //         'target_type': 'tracks'
            //     },
            // })
            // console.log('acceptedFiles:', acceptedFiles, 'ss:', session)
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${session?.access_token}`,
                            'target_type': 'tracks',
                            delay: 3000
                        },
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
                            props.setTrackUpload({
                                ...trackUpload,
                                fileName: acceptedFiles[0].name,
                                percent: percentCompleted
                            })
                            console.log('percentCompleted:', percentCompleted)
                        }
                    },
                )
                console.log('res:', res?.data?.data?.fileName)
                console.log('res:', res)
                if (res && res.data) {
                    props.setTrackUpload((prevState: any) => ({
                        ...prevState,
                        uploadedTrackName: res?.data?.data?.fileName
                    }))
                }
            } catch (error) {
                //@ts-ignore
                console.log('err:', error?.response?.data)
                setOpenMessage(true)
                //@ts-ignore
                setResMessage(error?.response?.data?.message)
                setTimeout(() => {
                    setOpenMessage(false)
                }, 3000)
            }
        }
    }, [session])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4', '.MP4'],
            'audio/mpeg': ['.mp3'],
            'audio/wav': ['.wav'],
        }
    });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <>
            <section className="container">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <InputFileUpload />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                </aside>
            </section>
            <Snackbar
                open={openMessage}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            // onClose={handleClose}
            >
                <Alert
                    onClose={() => setOpenMessage(false)}
                    severity="error"
                    // variant="filled"
                    sx={{ width: '100%' }}
                >
                    {resMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Step1