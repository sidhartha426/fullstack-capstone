import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
    const [dealersList, setDealersList] = useState([]);
    // let [state, setState] = useState("")
    const [states, setStates] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stateQuery, setStateQuery] = useState('');

    // let root_url = window.location.origin
    let dealer_url = "/djangoapp/get_dealers";

    let dealer_url_by_state = "/djangoapp/get_dealers/";

    const filterDealers = async (state) => {
        dealer_url_by_state = dealer_url_by_state + state;
        setSearchQuery("");
        setStateQuery(state);
        const res = await fetch(dealer_url_by_state, {
            method: "GET"
        });
        const retobj = await res.json();
        if (retobj.status === 200) {
            const state_dealers = Array.from(retobj.dealers)
            setDealersList(state_dealers);
        }
    }

    const get_dealers = async () => {
        const res = await fetch(dealer_url, {
            method: "GET"
        });
        const retobj = await res.json();
        if (retobj.status === 200) {
            const all_dealers = Array.from(retobj.dealers)
            const states = [];
            all_dealers.forEach((dealer) => {
                states.push(dealer.state);
            });

            setStates(Array.from(new Set(states)).sort());
            setDealersList(all_dealers);
        }
    }

    const handleInputChange = async(event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setStateQuery("All States");
        const res = await fetch(dealer_url, {
            method: "GET"
        });
        const retobj = await res.json();
        if (retobj.status === 200) {
            const all_dealers = Array.from(retobj.dealers)
            const filtered = all_dealers.filter(dealer =>
                dealer.state.toLowerCase().includes(query.toLowerCase())
            );
            setDealersList(filtered);
        }
    };

    const handleLostFocus = async () => {
        if (!searchQuery) {
            setStateQuery("All States");
            const res = await fetch(dealer_url, {
                method: "GET"
            });
            const retobj = await res.json();
            if (retobj.status === 200) {
                const all_dealers = Array.from(retobj.dealers)
                setDealersList(all_dealers);
            }
        }
    }

    useEffect(() => {
        get_dealers();
    }, []);


    let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
    return (
        <div>
            <Header />

            <table className='table'>
                <tr>
                    <th>ID</th>
                    <th>Dealer Name</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Zip</th>
                    <th>
                        <select name="state" id="state" value={stateQuery} onChange={(e) => filterDealers(e.target.value)}>
                            <option value="" selected disabled hidden>State</option>
                            <option value="All">All States</option>
                            {states.map(state => (
                                <option value={state}>{state}</option>
                            ))}
                        </select>
                        <input type="text" placeholder="Search states..." onChange={handleInputChange} onBlur={handleLostFocus} value={searchQuery} />

                    </th>
                    
                    {isLoggedIn ? (
                        <th>Review Dealer</th>
                    ) : <></>
                    }
                </tr>
                {dealersList.map(dealer => (
                    <tr>
                        <td>{dealer['id']}</td>
                        <td><a href={'/dealer/' + dealer['id']}>{dealer['full_name']}</a></td>
                        <td>{dealer['city']}</td>
                        <td>{dealer['address']}</td>
                        <td>{dealer['zip']}</td>
                        <td>{dealer['state']}</td>
                        {isLoggedIn ? (
                            <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review" /></a></td>
                        ) : <></>
                        }
                    </tr>
                ))}
            </table>;
        </div>
    )
}

export default Dealers
