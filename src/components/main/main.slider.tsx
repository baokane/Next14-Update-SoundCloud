'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from 'react-slick'
import { Box, Button, Divider } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import Image from "next/image";

interface IProps {
    data: ITrackTop[];
    title: string;
}

const MainSlider = (props: IProps) => {

    const { data, title } = props

    const PrevArrow = (props: any) => {
        return (
            <Button
                color="inherit"
                variant="contained"
                onClick={props.onClick}
                sx={{
                    // border: '1px solid #1c78d3',
                    position: 'absolute',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    top: '25%',
                    left: '-50px',
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronLeftIcon />
            </Button>
        )
    }

    const NextArrow = (props: any) => {
        return (
            <Button
                color="inherit"
                variant="contained"
                onClick={props.onClick}
                sx={{
                    // border: '1px solid #1c78d3',
                    position: 'absolute',
                    transform: 'translateY(-50%)',
                    top: '25%',
                    zIndex: 1,
                    right: '-50px',
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronRightIcon />
            </Button>
        )
    }

    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }
    return (
        <Box
            sx={{
                margin: '0 50px',
                '.track': {
                    padding: '0 20px',
                    'img': {
                        height: '100%',
                        width: '100%'
                    }
                },
                'h3': {
                    border: '1px solid #ccc',
                    padding: '20px',
                    margin: '0 10px',
                    height: '192px',
                    textAlign: 'center'
                }
            }}
        >
            <h2>{title}</h2>
            <Slider {...settings}>
                {data.map(track => {
                    return (
                        <div className="track" key={track._id}>
                            {/* <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} /> */}
                            <div style={{ position: 'relative', height: '171px', width: '171px' }}>
                                <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} alt="ảnh"
                                    fill
                                    style={{
                                        objectFit: 'contain', // cover, contain, none
                                    }}
                                />
                            </div>
                            <Link
                                href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
                            >
                                {track.title}
                            </Link>
                            <h5>{track.description}</h5>
                        </div>
                    )
                })}
            </Slider>
            <Divider sx={{ marginTop: '50px' }} />

        </Box>
    );
}

export default MainSlider