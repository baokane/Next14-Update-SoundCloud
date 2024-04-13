import ProfileTracks from "@/components/header/profile.tracks";
import { sendRequest } from "@/utils/api";
import { Container, Grid } from "@mui/material";

interface ITrackList {
    data: ITrackTop
}

const ProfilePage = async ({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {
    const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop[]>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
        method: 'POST',
        body: { id: params.slug },
        nextOption: {
            next:
                { tags: ['profile-track'] }
        }
    })

    // revalidateTag('collection')
    const data = tracks?.data?.result ?? []
    // console.log('params:', params)
    // const search = searchParams.get('audio')
    return (
        <Container sx={{ my: 5 }}>
            <Grid container spacing={5}>
                {data?.map((item: any) => {
                    // console.log('item:', item)
                    return (
                        <Grid item xs={12} md={6}>
                            <ProfileTracks
                                // data={data}
                                data={item}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Container>
    );
}

export default ProfilePage
