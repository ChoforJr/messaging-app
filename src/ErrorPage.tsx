import Link from "next/link";

const ErrorPage = () => {
  return (
    <div>
      <h1>Oh no, this route doesn't exist!</h1>
      <Link href="/">
        <p>You can go back to the home page by clicking here, though!</p>
      </Link>
    </div>
  );
};

export default ErrorPage;
