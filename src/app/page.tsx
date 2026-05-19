export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-100">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-orange-500 bg-clip-text text-transparent">
          Gymy
        </h1>
        <p className="text-xl text-gray-400 text-center max-w-md">
          The best gym app in the world. Track workouts, build routines, and
          crush your fitness goals.
        </p>
      </main>
    </div>
  );
}
