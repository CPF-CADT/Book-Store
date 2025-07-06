import  {LoginHeader}  from "./components/HeaderFooter";
import  {Homepage}  from "./components/Homepage";
import ProductGrid from "./components/ProductGrid";
// import FilterSideBar from "./components/FilterSideBar";
import SortControls from "./components/SortControls";

export function HomePageLayout() {
  return (
    <>
      <LoginHeader />
      <main className="flex">
        {/* <FilterSideBar /> */}
        <div className="flex-1">
          <Homepage />
          <SortControls />
          <ProductGrid />
        </div>
      </main>
    </>
  );
}