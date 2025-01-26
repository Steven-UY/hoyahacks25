import SignUpForm from '@/components/SignUpForm'
import LoginForm from '@/components/LoginForm'
import PatientDashboard from '@/components/PatientDashboard'
import OpenAIOcr from '@/components/camera/OpenAIOcr'


export default function Home() {
  return (
    <div className="">
      <SignUpForm/>
      <OpenAIOcr/>
    </div>
  )
}

