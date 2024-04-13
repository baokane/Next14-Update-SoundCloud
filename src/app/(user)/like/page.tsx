
import type { Metadata } from 'next'
import Container from "@mui/material/Container";
import { convertSlugUrl, sendRequest } from '@/utils/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.options';
import LikeComponent from '@/components/like/like.page';

export const metadata: Metadata = {
    title: 'Tracks bạn đã liked',
    description: 'miêu tả thôi mà',
}

const LikePage = async () => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['liked-by-user'] }
        }
    })

    const likes = res?.data?.result ?? [];
    return (
        <Container>
            <LikeComponent likes={likes} />
        </Container>
    )
}

export default LikePage;