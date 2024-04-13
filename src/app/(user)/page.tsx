import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
// import { sendRequestJS } from '@/utils/old.api'
import { sendRequest } from '@/utils/api'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/auth.options";

export default async function HomePage() {

  const session = await getServerSession(authOptions)
  console.log('...Secsion:', session)

  // Cách 1: kiểu thổ dân

  // const res = await fetch('http://localhost:8000/api/v1/tracks/top', {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     category: 'CHILL',
  //     limit: 5
  //   })
  // })
  // const data = res.json()
  // console.log('>>> data: ', data)

  // Cách 2:API wrapper fetch (dùng JS)

  // const res = await sendRequestJS({
  //   url: 'http://localhost:8000/api/v1/tracks/top',
  //   method: 'POST',
  //   body: {
  //     category: 'CHILL',
  //     limit: 5
  //   }
  // })
  // console.log('>>>> res: ', res)

  // Cách 3:API wrapper fetch (dùng TS)

  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: { category: 'CHILL', limit: 10 },

  })

  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: { category: 'WORKOUT', limit: 10 },
  })

  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: { category: 'PARTY', limit: 10 },
  })
  // console.log('>>>> res (TS): ', chills)

  return (
    <Container>
      <MainSlider
        title={'Top Chill'}
        data={chills?.data ? chills.data : []}
      // hoặc : data={chills?.data ?? []}
      />
      <MainSlider
        title={'Top Workout'}
        data={workouts?.data ?? []}
      />
      <MainSlider
        title={'Top Party'}
        data={party?.data ?? []}
      />
    </Container>
  );
}
