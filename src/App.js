import { useState, useEffect } from 'react';
import { useFavicon } from 'react-use';
import logo from "./wiki-logo.png";
import ReactPaginate from 'react-paginate';


export default function App() {

  const [ searchItem, setSearchItem ] = useState('');
  const [ isSearching, setIsSearching] = useState(false);
  const [ data, setData] = useState([]);
  const [ error, setError] = useState('');
  const [ currentPage, setCurrentPage ] = useState(0);

  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=extracts&exchars=250&exintro=true&explaintext=true&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchItem}`;

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  // const currentPageData = data
  //     .slice(offset, offset + PER_PAGE)
  //     .map( data => (data.title || []));
  const pageCount = Math.ceil(data.length / PER_PAGE);

  useFavicon(logo);

  useEffect(() => {
    wikiApiFetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wikiApiFetch = () => { 
    fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error ('Request Failed');
      }
      return response.json();
    })
    .then(json => {
      setData(json?.query?.search || []);
    })
    .catch(error => {
      setError('An error occured');
    })
    .finally(() => {
      // Allow input box to be editable again and delete previous text 
      setIsSearching(false);
      setSearchItem('');
    });

  };

  const handleSubmit = (e) => { 
  console.log('submit called');
    
    e.preventDefault();

    // If there is nothing in the text box, do not do anything
    if (!searchItem || searchItem === '') return 
    
    // params.gsrsearch = searchItem;
    //  // The input box should be uneditable
    setIsSearching(true);

    // Fetch api data 
      wikiApiFetch();
  };

  console.log(data)

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }


  return (
    <div className="App">
      <div className="mb-40 mt-60" >
        <img src={logo} alt="wikiLogo" className="max-w-xs justify-center mx-auto my-auto mb-10 flex-wrap relative w-1/3" />
        <div className="relative mb-4 flex w-1/4 flex-wrap items-stretch justify-center mx-auto my-auto">
          <input
            type="search"
            className="relative m-0 block w-[1px] min-w-0 flex-auto rounded border border-solid border-button-hover bg-transparent 
            bg-clip-padding px-3 py-[0.5rem] text-base font-normal leading-[1.8] text-button-hover 
            outline-none transition duration-200 ease-in-out focus:z-[3]
             focus:border-button-beige focus:text-button-hover focus:shadow-[inset_0_0_0_2px_rgb(59,113,202)] 
             focus:outline-none dark:border-button-hover dark:text-button-hover placeholder:text-button-beige dark:focus:border-button-hover"
            placeholder="What are you searching for?"
            aria-label="Search"
            aria-describedby="button-addon2"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            
          />
          <span
            className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-button-hover dark:text-button-hover"
            onClick={handleSubmit}
            id="basic-addon2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="max-w-[1024px] mx-auto mt-0">
        <div className="grid grid-cols-1 gap-10">



        {data &&
          data
          .slice(offset, offset + PER_PAGE).map((d, i) => {
            const url = `https://en.wikipedia.org/?curid=${d.pageid}`;
            return (
              <div className="data-result shadow-md hover:bg-button-hover hover:relative hover:top-[-2px] hover:left-[-2px] p-4 bg-button-beige border-2 border-solid border-button-brown rounded-lg shadow-button-brown text-button-brown" key={i}>
                <h2 className="font-black">{d.title}</h2>
                <p dangerouslySetInnerHTML={{ __html: d.snippet }}></p>
                <a href={url} className="text-xs italic">..Read More</a>
              </div>
            );
          })}
          </div>
      </div>
      <div>
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
      </div>
    </div>
  );   
}



