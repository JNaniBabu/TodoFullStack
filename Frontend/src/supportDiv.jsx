
function supportTeam({show}) {
    console.log(show);
    
    return <div
                          className="supportDiv"
                          style={
                            show.includes(i)
                              ? {
                                  display: "flex",
                                  transform: "translate(0px,0px)",
                                }
                              : {
                                  display: "none",
                                  transform: "translate(0px,-30px)",
                                }
                          }
                          
                        >
                          <div className="supportDivChildOne">
                              {matter[i]?.map((line, idx) => (<h6 key={idx} >{line}</h6>))}
                          </div>
                          <div className="supportDivChildTwo">
                             <input type="text" placeholder="Enter Here" value={''} ref={supportUserREF} onChange={handleSupportUSER}/>
                             <button type="button" className="supportButton" onClick={()=>handleSupport("i prefer non veg ",90)}>Enter</button>
                          </div>

                        </div>
}

export default supportTeam