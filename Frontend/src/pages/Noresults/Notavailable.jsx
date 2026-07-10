export default function NotAvailable() {
  return (
    <>
      <div>
        <div class=" flex justify-center items-center m-12 gap-24 ">
          <div class="">
            <h1 class="text-2xl">Sorry, no results found</h1>
            <h4 class="">Try again with fewer filters</h4>
          </div>
          <div>
            <img
              alt="Sorry, no results found"
              src="https://b.zmtcdn.com/web/assets/f0b1bdc4cdae3c9e54964d791e83be401614320771.jpeg"
              loading="lazy"
              class=" max-w-sm w-32"
            />
          </div>
        </div>
      </div>
    </>
  );
}
