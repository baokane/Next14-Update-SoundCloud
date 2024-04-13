'use client'
import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Grid } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';
import Image from 'next/image';

// Progress bar
function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

function ProgressBar(props: IProps) {
    const { trackUpload } = props

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={trackUpload.percent} />
        </Box>
    );
}

// Upload button
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

// 
function InputFileUpload(props: any) {
    const { setInfo, info } = props
    const { data: session } = useSession()

    const [openMessage, setOpenMessage] = React.useState<boolean>(false)
    const [resMessage, setResMessage] = React.useState<string>('')

    const handleUpload = async (image: any) => {

        const formData = new FormData();
        formData.append('fileUpload', image);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`,
                        'target_type': 'images',
                        delay: 3000
                    },
                },
            )
            console.log('res:', res?.data?.data?.fileName)
            console.log('res:', res)
            setInfo({
                ...info,
                imgUrl: res?.data?.data?.fileName
            })
            if (res && res.data) {
                setInfo({
                    ...info,
                    imgUrl: res?.data?.data?.fileName
                })
                setOpenMessage(true)
                //@ts-ignore
                setResMessage("Upload file thành công!")
                setTimeout(() => {
                    setOpenMessage(false)
                }, 3000)
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
    return (
        <>
            <Button
                onChange={(e) => {
                    const event = e.target as HTMLInputElement
                    if (event.files) {
                        handleUpload(event.files[0])
                    }
                }}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{
                    marginTop: '10px'
                }}
            >
                Upload file
                <VisuallyHiddenInput type="file" />
            </Button>

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
    )
}

// Text Field
const currencies = [
    {
        value: 'chill',
        label: 'Chill',
    },
    {
        value: 'workout',
        label: 'Workout',
    },
    {
        value: 'party',
        label: 'Party',
    },
];

interface IProps {
    trackUpload: {
        fileName: string;
        percent: number;
        uploadedTrackName: string;
    };
    setValue: (v: number) => void;
}

interface INewTrack {
    title: string;
    description: string;
    trackUrl: string;
    category: string;
    imgUrl: string;
}

const Step2 = (props: IProps) => {
    const { data: session } = useSession()

    const toast = useToast()

    const { trackUpload, setValue } = props

    const [info, setInfo] = React.useState<INewTrack>({
        title: '',
        description: '',
        trackUrl: '',
        category: '',
        imgUrl: '',
    })

    React.useEffect(() => {
        if (trackUpload && trackUpload.uploadedTrackName) {
            console.log('>>> track :', trackUpload)
            setInfo({
                ...info,
                trackUrl: trackUpload.uploadedTrackName
            })
        }
    }, [trackUpload])

    const handleSubmitForm = async () => {

        console.log('info:', info)
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
            },
            body: {
                title: info.title,
                description: info.description,
                trackUrl: info.trackUrl,
                category: info.category,
                imgUrl: info.imgUrl,
            },
        })
        console.log('reess:', res)
        if (res && res.data) {
            toast.success('Tạo mới bài track thành công!')
            setValue(0)
        } else {
            toast.error(res.message)
        }
    }
    return (
        <div>
            <div>{trackUpload.fileName}</div>
            <div style={{ marginBottom: 60 }}>
                <ProgressBar
                    trackUpload={trackUpload}
                    setValue={setValue}
                />
            </div>
            <Grid
                container
                spacing={2}

            >
                <Grid item xs={6} md={4} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div
                        style={{ height: 250, width: 250, background: '#ccc' }}
                    >
                        {info.imgUrl &&
                            // <img
                            //     height={250}
                            //     width={250}
                            //     src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`} alt='ảnh'
                            // />
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                                alt='step2 track url'
                                height={250}
                                width={250}
                            />
                        }
                    </div>
                    <InputFileUpload
                        setInfo={setInfo}
                        info={info}
                    />

                </Grid>
                <Grid item xs={6} md={8} >
                    <TextField
                        value={info?.title}
                        onChange={(e) => setInfo({
                            ...info,
                            title: e.target.value
                        })}
                        label="Title"
                        variant="standard"
                        fullWidth
                        margin='dense'
                    />
                    <TextField
                        value={info?.description}
                        onChange={(e) => setInfo({
                            ...info,
                            description: e.target.value
                        })}
                        label="Description"
                        variant="standard"
                        fullWidth
                        margin='dense'
                    />

                    <TextField
                        value={info?.category}
                        onChange={(e) => setInfo({
                            ...info,
                            category: e.target.value
                        })}
                        sx={{ mt: 2 }}
                        fullWidth
                        select
                        label="Category"
                        defaultValue="EUR"
                        variant="standard"
                    >
                        {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        onClick={() => handleSubmitForm()}
                        variant="outlined"
                        sx={{
                            marginTop: '37px'
                        }}
                    >
                        Save</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default Step2