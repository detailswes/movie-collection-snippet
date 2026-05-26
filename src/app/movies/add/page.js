import MoviesForm from "components/MoviesForm";

const AddMovie = () => {
  return (
    <div className="container px-6">
      <div className="py-32">
        <div className="w-full xl:w-10/12 m-auto">
          <h1 className="mb-16 md:mb-32 text-[32px] lg:text-5xl">
            Create a new movie
          </h1>
          <MoviesForm />
        </div>
      </div>
    </div>
  );
};

export default AddMovie;
