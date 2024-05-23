import {Link} from "react-router-dom"

export default function Dash() {
  return (
    <>
      <div class="container-fluid">
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
          <Link
            to="create"
            class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          >
            <i class="fas fa-download fa-sm text-white-50"></i> Create New Test
          </Link>
        </div>

        <div class="row">
          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
              <div class="card-body">
                <div class="row no-gutters align-items-center">
                  <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Subjects
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                      4
                    </div>
                  </div>
                  <div class="col-auto">
                    <i class="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
              <div class="card-body">
                <div class="row no-gutters align-items-center">
                  <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Test Attemted by Students
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                      1
                    </div>
                  </div>
                  <div class="col-auto">
                    <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-info shadow h-100 py-2">
              <div class="card-body">
                <div class="row no-gutters align-items-center">
                  <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Students (Attendance &gt; 75%)
                    </div>
                    <div class="row no-gutters align-items-center">
                      <div class="col-auto">
                        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                          90 %
                        </div>
                      </div>
                      <div class="col">
                        <div class="progress progress-sm mr-2">
                          <div
                            class="progress-bar bg-info"
                            role="progressbar"
                            style={{ width: "90%" }}
                            aria-valuenow="50"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-warning shadow h-100 py-2">
              <div class="card-body">
                <div class="row no-gutters align-items-center">
                  <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Total Students
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">100</div>
                  </div>
                  <div class="col-auto">
                    <i class="fas fa-comments fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        <div class="row">
          <div class="col-lg-6 mb-4">
            <div class="card shadow mb-4">
              <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Result</h6>
              </div>
              <div class="card-body">
                <h4 class="small font-weight-bold">
                  Score greater less than 10 <span class="float-right">20%</span>
                </h4>
                <div class="progress mb-4">
                  <div
                    class="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: "20%" }}
                    aria-valuenow="20"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <h4 class="small font-weight-bold">
                Score between 10 to 15 <span class="float-right">40%</span>
                </h4>
                <div class="progress mb-4">
                  <div
                    class="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: "40%" }}
                    aria-valuenow="40"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <h4 class="small font-weight-bold">
                Score between 15 to 25 <span class="float-right">60%</span>
                </h4>
                <div class="progress mb-4">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style={{ width: "60%" }}
                    aria-valuenow="60"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <h4 class="small font-weight-bold">
                Score greater than 25 <span class="float-right">45%</span>
                </h4>
                <div class="progress mb-4">
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: "45%" }}
                    aria-valuenow="80"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <h4 class="small font-weight-bold">
                  Not attempted <span class="float-right">2%</span>
                </h4>
                <div class="progress">
                  <div
                    class="progress-bar bg-info "
                    role="progressbar"
                    style={{ width: "2%" }}
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
