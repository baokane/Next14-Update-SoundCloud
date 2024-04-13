'use client'
import { fetchDefaultImages, sendRequest } from '@/utils/api';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { url } from 'inspector';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Image from 'next/image';
dayjs.extend(relativeTime)

interface IProps {
    track: ITrackTop | null;
    comment: ITrackComment[];
    wavesurfer: WaveSurfer | null;
}

interface ICreateComment {
    "content": string;
    "moment": string;
    "user": string;
    "track": string;
    "isDeleted": string;
    "_id": string;
    "createdAt": string;
    "updatedAt": string;
}

const CommentTrack = (props: IProps) => {
    const { track, comment, wavesurfer } = props
    const [yourComment, setYourComment] = useState('')

    const { data: session } = useSession()
    const router = useRouter();

    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ICreateComment>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
                track: track?._id
            }
        })
        console.log('res:', res)
        if (res && res.data) {
            await sendRequest<IBackendRes<any>>({
                url: '/api/revalidate',
                method: 'POST',
                queryParams: {
                    tag: 'track-by-id',
                    secret: 'justArandomString'
                }
            })
            router.refresh();
            setYourComment('')
        }
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play();
        }
    }

    return (
        <>
            <TextField id="standard-basic" label="Comment" variant="standard" fullWidth
                value={yourComment}
                onChange={(e) => setYourComment(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        // alert('me')
                        handleSubmit()
                    }
                }}
                sx={{
                    margin: '70px 0 30px'
                }}
            />
            <div
                className='container-wrapper'
                style={{ display: 'flex', }}
            >

                <div className='left' style={{ display: 'flex', gap: 100 }}>
                    <div className='avatar-info' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* <img style={{
                            width: 100,
                            height: 100,
                            marginBottom: 15
                        }}
                            src={
                                //@ts-ignore
                                fetchDefaultImages(track?.uploader?.type)
                            }
                        /> */}
                        <Image
                            src={fetchDefaultImages(track?.uploader?.type!)}
                            alt='avatar comment'
                            height={150}
                            width={150}
                        />
                        <div>
                            {track?.uploader?.email}
                        </div>
                    </div>

                </div >

                <div className='right' style={{ flex: '1' }}>
                    <ul style={{ flex: '1', marginTop: '-15px' }}>
                        {comment.map(item => {
                            return (
                                <li
                                    key={item._id}
                                    style={{
                                        display: 'flex',
                                        gap: 30,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 15
                                    }}>
                                    <div className='comment-info-left'
                                        style={{
                                            display: 'flex',
                                            gap: 30,
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {/* <img
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            src={}
                                        /> */}
                                        <Image
                                            src={fetchDefaultImages(item?.user?.type)}
                                            alt='comment'
                                            width={40}
                                            height={40}
                                        />
                                        <div>
                                            <div style={{ fontSize: 16, color: '#958d8d' }}>{item?.user?.email} at &nbsp;
                                                <span onClick={() => handleJumpTrack(item.moment)}
                                                >
                                                    {formatTime(item.moment)}
                                                </span>
                                            </div>

                                            {/* comment */}
                                            <div style={{ fontSize: 18, color: 'black' }}>{item?.content}</div>
                                        </div>
                                    </div>
                                    <div className='comment-info-right' style={{ fontSize: 14, color: '#e4e0e0' }}>
                                        {dayjs(item?.createdAt).fromNow()}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

            </div>
        </>
    )
}

export default CommentTrack