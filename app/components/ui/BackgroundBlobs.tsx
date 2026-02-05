export default function BackgroundBlobs() {
  return (
    <>
      <div className="pointer-events-none absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-[#ffffff] rounded-full blur-[100px] opacity-40" />
      <div className="pointer-events-none absolute top-[30%] right-[5%] w-[350px] h-[350px] bg-cyan-300 rounded-full blur-[90px] opacity-40" />
      <div className="pointer-events-none absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] opacity-30" />
      <div className="pointer-events-none absolute bottom-[10%] right-[20%] w-[250px] h-[250px] bg-purple-400 rounded-full blur-[80px] opacity-40" />
    </>
  )
}
