const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-white overflow-auto bg-gradient-to-b from-black to-green-900">
      <div className="mx-auto max-w-screen-xl h-full w-full">{children}</div>
    </main>
  );
};
export default LandingLayout;
