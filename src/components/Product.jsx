import {useEffect, useRef} from "react";
import JsBarcode from "jsbarcode";
import {CubeIcon, CurrencyEuroIcon, ShoppingCartIcon} from "@heroicons/react/24/outline";

const Product = ({item, sellItem}) => {
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, item.barcode, {
                format: "CODE128",
                displayValue: false,
                height: 50,
                width: 2.2,
            });
        }
    }, [item.barcode]);

    return (
        <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md sm:p-8">
            <h5 className="mb-4 text-xl font-medium text-gray-600">{item.name}</h5>

            {/* ✅ Render Barcode */}
            <svg ref={barcodeRef} className="block mx-auto"></svg>

            {/* ✅ Display Barcode as Text */}
            <div className="text-center text-sm text-gray-600 mt-2">
                {item.barcode}
            </div>

            {/* ✅ Product Details */}
            <ul role="list" className="space-y-5 my-7">
                <li className="flex items-center">
                    <CubeIcon className="shrink-0 w-6 h-6 text-blue-700"/>
                    <span className="text-base font-normal leading-tight text-gray-600 ms-3">
                        {item.stock} Stück
                    </span>
                </li>

                <li className="flex items-center">
                    <CurrencyEuroIcon className="shrink-0 w-6 h-6 text-blue-700"/>
                    <span className="text-base font-normal leading-tight text-gray-600 ms-3">
                        {item.price.toFixed(2)} EUR
                    </span>
                </li>
            </ul>

            {/* ✅ Manual Sell Button */}
            <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200
                           font-medium rounded-lg text-md px-5 py-3 inline-flex justify-center w-full text-center"
                onClick={() => sellItem(item.barcode)}
            >
                <ShoppingCartIcon className="w-5 h-5"/>
            </button>
        </div>
    );
};

export default Product;
