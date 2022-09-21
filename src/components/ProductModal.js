import axios from "axios";
import React, { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import { ReactComponent as Close } from "../assets/close.svg";
import { ReactComponent as Search } from "../assets/search.svg";

import { Checkbox } from "./Checkbox";

const ProductModal = ({
  productsField,
  setProductsField,
  setmodal,
  pIndex,
}) => {
  const [productData, setProductData] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [pickedProducts, setPickedProducts] = useState(productsField);

  useEffect(() => {
    if (page === 1) {
      const fetchData = async () => {
        let items = await axios.get(
          `https://stageapibc.monkcommerce.app/admin/shop/product?search=${search}&page=${page}`
        );
        setProductData(items?.data);
      };
      fetchData();
    }
    if (page !== 1) {
      const fetchData = async () => {
        let newitems = await axios.get(
          `https://stageapibc.monkcommerce.app/admin/shop/product?search=${search}&page=${page}`
        );
        if (newitems.length > 1)
          newitems?.data?.map((data) => setProductData([...productData, data]));
      };
      fetchData();
    }
  }, [search, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setPage(page + 1);
    }
  };

  const handleSelectProduct = ({ data, idx, temp }) => {
    console.log(data, idx);
    console.log(temp);

    let newArray = [...pickedProducts];
    newArray[pIndex] = data;
    setPickedProducts(newArray);

    if (temp) {
      let newArray = [...pickedProducts];
      let temparr = data?.variants?.filter((x) => temp?.includes(x.id));
      newArray[pIndex] = { ...newArray[pIndex], variants: temparr };
      setPickedProducts(newArray);
    }
  };

  const handleAdd = () => {
    setProductsField(pickedProducts);
    setmodal(false);
  };
  console.log(pickedProducts, "main");

  console.log(productData);

  return (
    <div>
      <div className="flex flex-col absolute left-16 md:left-28 lg:left-64 top-12 bottom-8 rounded-sm bg-white border border-1 z-50 w-2/3">
        <div className="flex w-full justify-between py-2 px-6 border-b-2">
          <span className="text-lg font-semibold">Select Products</span>
          <button onClick={() => setmodal(false)}>
            <Close />
          </button>
        </div>
        <div className="flex px-6 py-2 border-b-2">
          <div className="flex items-center py-1 px-2 w-full border-2">
            <Search />
            <input
              type="text"
              value={search}
              placeholder="Search product "
              className="w-full ml-4 outline-none border-none"
              onChange={handleSearch}
            />
          </div>
        </div>
        <div
          className="flex flex-col px-6 py-2 overflow-y-auto"
          onScroll={handleScroll}
        >
          {!productData ? (
            <Circles
              height="40"
              width="40"
              color="#4fa94d"
              ariaLabel="circles-loading"
              wrapperClass="flex w-full justify-center mt-4"
              visible={true}
            />
          ) : (
            productData.map((data, index) => {
              let list = data?.variants?.map((newdata) => {
                return newdata.id;
              });
              return (
                <div className="flex flex-col">
                  <div className="flex items-center my-2">
                    <Checkbox
                      checked={selected[0] === list[0]}
                      indeterminate={
                        selected.length > 0 && selected.length < list.length
                      }
                      onChange={(event) => {
                        handleSelectProduct({ data: data, idx: index });
                        if (event.target.checked) {
                          setSelected(list);
                        } else {
                          setSelected([]);
                        }
                      }}
                    />
                    <img
                      src={data?.image?.src}
                      alt="product"
                      className="h-10 border-2 mr-3"
                    />{" "}
                    <span>{data?.title}</span>
                  </div>
                  {data?.variants?.map((vardata, index) => {
                    return (
                      <div className="flex pl-8 items-center border-t-2">
                        <Checkbox
                          checked={selected.includes(vardata?.id)}
                          onChange={() => {
                            if (selected.includes(vardata?.id)) {
                              var temp = selected.filter(
                                (i) => i !== vardata?.id
                              );
                              setSelected(temp);
                              // setSelected((s) =>
                              //   s.filter((i) => i !== vardata?.id)
                              // );
                            } else {
                              setSelected((s) => [...s, vardata?.id]);
                            }
                            handleSelectProduct({ temp: temp, data: data });
                          }}
                        />
                        <div className="flex w-full justify-between ml-2 py-2">
                          <span className="w-1/3">{vardata?.title}</span>
                          <span>{vardata?.inventory_quantity}</span>
                          <span>
                            {"$"}
                            {vardata?.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
        <div className="flex w-full justify-end px-6 py-2">
          <button
            className="outline-none border-2 border-gray-300 px-5 py-0.5 rounded-sm"
            onClick={() => setmodal(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="outline-none border-none px-4 py-0.5 ml-2 bg-primary text-white rounded-sm"
          >
            Add
          </button>
        </div>
      </div>
      <div className="fixed h-full w-full top-0 left-0 bg-black opacity-50"></div>
    </div>
  );
};

export default ProductModal;
