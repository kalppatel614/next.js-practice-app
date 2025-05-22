export default function UserProfile({ params }: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Profile</h1>
      <hr />
      <p className="text-2xl">
        Profile Page
        <span className="text-4xl p-2 ml-2  bg-gray-200 text-gray-900 rounded-md">
          {params.id}
        </span>
      </p>
    </div>
  );
}
