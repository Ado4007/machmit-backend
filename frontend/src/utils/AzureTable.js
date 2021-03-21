import {Component} from 'react';
import React from 'react';
import ReactTable from 'react-table';
//import "../react-table.css";
import request from 'request-promise-native';
import ValidatedFormComponent from "./ValidatedFormComponent";

class AzureTable extends Component {
    constructor(props) {
        /*
            Props:
                - access_code

                - additionalData

                - logout

                - onLoad
                - columns
                - defaultSorted
                - pageSize
                - SubComponent
                - getTdProps

                - functionUrl

                - tableRef
        */
        super(props);

        this.state = {
            data: null,
            loading: true,
            filterValues: {},

            tableLoading: false,
            pages: 1,
            page: 0
        };

        this.pageCache = null;

        this.currentOrderDesc = null;
        this.currentOrderParam = null;

        this.lastState = null;

        if (this.props.tableRef != null) {
            this.props.tableRef({
                resetTable: this.resetTable.bind(this),
                getAllData: this.getAllData.bind(this),
                isEverythingLoaded: this.isEverythingLoaded.bind(this),
                getAllDataCount: this.getAllDataCount.bind(this),
                getActiveFilters: this.getActiveFilters.bind(this)
            });
        }

    }

    getActiveFilters() {
        return this.lastFiltered;
    }

    isEverythingLoaded() {
        return !!this.last;
    }

    getAllData() {
        const arr = [];
        if(this.pageCache!=null) for (let page of this.pageCache) {
            if(page!=null) for (let row of page) {
                arr.push(row);
            }
        }
        return arr;
    }

    getAllDataCount() {
        let i = 0;
        for (let page of this.pageCache) {
            i+=page.length;
        }
        return i;
    }


    resetTable() {
        this.pageCache = null;
        this.last = false;
        this.setState({
            page: 0
        },() => {
            this.fetchData.bind(this)(this.lastState);
        });
    }

    async fetchData(state,instance) {
        console.log("State: ",state);
        console.log("Instance: ",instance);

        const sort = state.sorted[0];

        this.lastState = state;

        console.log("Sort:",sort);

        console.log("Filter:",state.filtered);

        const filter = state.filtered;

        if(sort.desc!==this.currentOrderDesc || sort.id!==this.currentOrderParam || !(this.lastFiltered.length==filter.length && this.lastFiltered.every(function(u, i) {
            return JSON.stringify(u) === JSON.stringify(filter[i]);
        })) ) {
            this.currentOrderDesc = sort.desc;
            this.currentOrderParam = sort.id;
            this.pageCache = null;
            this.setState({
                page: 0
            });
        }

        let onlyPage = this.pageCache!=null;

        this.lastFiltered = filter;

        console.log("Filter",filter);
        console.log("Last filter",this.lastFiltered);

        this.setState({
            tableLoading: true
        });

        if(this.pageCache==null) {

            const sendBody = {
                access_code: this.props.access_code,

                orderParam: this.currentOrderParam,
                orderDescending: this.currentOrderDesc,

                search: state.filtered
            };

            if(this.props.additionalData!=null) for(let p in this.props.additionalData) {
                sendBody[p] = this.props.additionalData[p];
            }

            const options = {
                method: 'POST',
                uri: this.props.functionUrl,
                body: sendBody,
                json: true,
                resolveWithFullResponse: true,
                simple: false
            };

            const response = await request(options);

            if(response.statusCode!=200) {
                console.log('Logging out!');
                this.props.logout();
                return;
            }

            this.pageCache = [];
            if(response.body!=null) this.pageCache[0] = response.body;

            if(response.body==null || response.body[0]==null || response.body[0].last) {
                this.setState({
                    data: response.body,
                    tableLoading: false,
                    loading: false,
                    pages: 1
                });
                this.last = true;
                this.continuationToken = null;
            } else {
                this.setState({
                    data: response.body,
                    tableLoading: false,
                    loading: false,
                    pages: 2
                });
                this.last = false;
                this.continuationToken = response.body[0].continuationToken;
            }

            console.log("Data request success", response.body);
        } else {
            if(this.pageCache[instance.state.page]!=null) {
                this.setState({
                    data: this.pageCache[instance.state.page],
                    tableLoading: false,
                    loading: false
                });
            } else {

                let last = null;

                if(this.pageCache[instance.state.page-1]!=null) {
                    const page = this.pageCache[instance.state.page-1];
                    console.log("Page: "+(instance.state.page-1), page);
                    last = page[9][this.currentOrderParam];
                }
                console.log("Last: "+last);

                const sendBody = {

                    access_code: this.props.access_code,

                    orderParam: this.currentOrderParam,
                    orderDescending: this.currentOrderDesc,
                    last,

                    search: state.filtered
                };

                if(this.continuationToken!=null) {
                    delete sendBody.last;
                    sendBody.continuationToken = this.continuationToken;
                }

                if(this.props.additionalData!=null) for(let p in this.props.additionalData) {
                    sendBody[p] = this.props.additionalData[p];
                }

                const options = {
                    method: 'POST',
                    uri: this.props.functionUrl,
                    body: sendBody,
                    json: true,
                    resolveWithFullResponse: true,
                    simple: false
                };

                const response = await request(options);

                if(response.statusCode!=200) {
                    console.log('Logging out!');
                    this.props.logout();
                    return;
                }

                if(response.body!=null) this.pageCache[instance.state.page] = response.body;

                if(response.body==null || response.body[0]==null || response.body[0].last) {
                    this.setState({
                        data: response.body,
                        tableLoading: false,
                        loading: false,
                        pages: instance.state.page+1
                    });
                    this.last = true;
                    this.continuationToken = null;
                } else {
                    this.setState({
                        data: response.body,
                        tableLoading: false,
                        loading: false,
                        pages: instance.state.page+2
                    });
                    this.last = false;
                    this.continuationToken = response.body[0].continuationToken;
                }

                console.log("Data request success", response.body);
            }
        }

        if(this.props.onLoad!=null) this.props.onLoad(onlyPage);
    }

    render() {

        for(let c of this.props.columns) {
            if(c.filterable) {
                if(c.Filter==null) {
                    if(c.filterOptions!=null && c.filterValueKey!=null) {
                        const arr = [...c.filterOptions];
                        arr.unshift({
                            [c.filterValueKey]: ""
                        });
                        c.Filter = ({ filter, onChange }) => {
                            return (
                                <ValidatedFormComponent type="select"
                                                        onChange={(value) => {
                                                            onChange(value);

                                                            const cpy = {...this.state.filterValues};
                                                            cpy[c.accessor] = value;
                                                            this.setState({
                                                                filterValues: cpy
                                                            });

                                                            if(value!=null && value!=='') {
                                                                this.setState({
                                                                    ["state"+c.accessor]: "success"
                                                                })
                                                            } else {
                                                                this.setState({
                                                                    ["state"+c.accessor]: null
                                                                })
                                                            }
                                                        }}
                                                        value={this.state.filterValues[c.accessor]}
                                                        value_key={c.filterValueKey}
                                                        display_name_key={c.filterValueKey}
                                                        options={arr}
                                                        onValidate={() => null}/>
                            );
                        }
                    } else {
                        c.Filter = ({ filter, onChange }) => {
                            return (
                                <ValidatedFormComponent type="text"
                                                        placeholder={"Search "+c.Header+"..."}
                                                        onChange={(val) => {
                                                            const cpy = {...this.state.filterValues};
                                                            cpy[c.accessor] = val;
                                                            this.setState({
                                                                filterValues: cpy
                                                            });
                                                        }}
                                                        value={this.state.filterValues[c.accessor]}
                                                        inputRef={(ref) => {
                                                            ref.onkeydown = (e) => {
                                                                if(e.keyCode==13) {
                                                                    onChange(ref.value);
                                                                    if(ref.value!=null && ref.value!=='') {
                                                                        this.setState({
                                                                            ["state"+c.accessor]: "success"
                                                                        })
                                                                    } else {
                                                                        this.setState({
                                                                            ["state"+c.accessor]: null
                                                                        })
                                                                    }
                                                                }
                                                            };
                                                        }}
                                                        validationState={this.state["state"+c.accessor]}
                                                        onValidate={() => null}/>
                            );
                        }
                    }
                }
            }
        }

        return (
            <ReactTable
                getTdProps={this.props.getTdProps}
                loading={this.state.tableLoading}
                SubComponent={this.props.SubComponent}
                data={this.state.data==null ? [] : this.state.data}
                columns={this.props.columns}
                defaultSorted={this.props.defaultSorted}
                manual
                pageText={""}
                ofText={""}
                renderCurrentPage={() => ""}
                renderTotalPagesCount={() => " "}
                pages={this.state.pages}
                page={this.state.page}
                onPageChange={(pageIndex) => this.setState({
                    page: pageIndex
                })}
                onFetchData={this.fetchData.bind(this)}
                showPageJump={false}
                showPageSizeOptions={false}
                defaultPageSize={10}
                className="-striped -highlight"
                collapseOnDataChange={false}
            />
        );
    }
}

export default AzureTable;