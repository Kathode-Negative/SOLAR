class Route{
    constructor(id,name,user_id,planets,booked,favourite){
        this.id = id;
        this.name = name;
        this.user_id = user_id;
        this.booked = booked;
        this.favourite = favourite;
        //list of planets in order
        this.planets = planets;
    }
}

export {Route}