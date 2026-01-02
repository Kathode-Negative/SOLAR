import React from "react";
import './../../../assets/styles/GUI.css'
import Canvas from "./Canvas";


/** Displays Planets selected in route. Input tailwind style, list of planets (names + colors) in order and direction (vertical/horizontal) */
const RouteHistoryPanel = ({className, planets, direction}) =>{
    const buffer = 50;
    var spacing = 80;
    const smallRadius = 20;
    const bigRadius = 40;
    let nodes = [];

    /** returns constant canvas size */
    const getCanvasSize = () => {
        if(direction == 'horizontal'){
            return {width: 500, height:300}
        }else{
            return {width: 300, height:500}
        }
    }
    
    const canvasSize = getCanvasSize();

    //** returns intital position of node, centered in view depending on direction */
    const getInitalPosition = (view) =>{
        const center = view.center;
        if(direction == 'horizontal'){
            return {x:buffer + smallRadius,y: center.y}
        }else{
            return {x:center.x,y:buffer + smallRadius}
        }
        
    }
    const getBackgroundSize = ()=>{
        var width = 0;
        var height = 0;
        if(direction == 'horizontal'){
            width = (bigRadius*2 + spacing)*planets.length - spacing;
            height = (buffer * 2)
        }else{
            width = (buffer * 2)
            height = (bigRadius* 2 + spacing)*planets.length - spacing;
        }
        return {width,height}
    }
    const getBackgroundKoord = (scope)=>{
        var x = 0;
        var y = 0;
        var offset = (buffer + bigRadius);
        if(direction == 'horizontal'){
            x = 0;
            y = scope.view.center.y - offset;
        }else{
            x = scope.view.center.x - offset;
            y = 0;
        }
        return {x,y}
    }

    //** increses current position by predefined constants */
    const increasePosition = (position) =>{
        if(direction == 'horizontal'){
            position.x = position.x + smallRadius * 2 + spacing;
        }else{
            position.y = position.y + smallRadius * 2 + spacing;
        }
        return {x:position.x, y:position.y}
    }

    /** returns offset planet position given node position */
    const getPlanetPosition = (position, index) => {
        var planetPosition= {}
        if(direction == 'horizontal'){
            planetPosition.x = position.x;
            planetPosition.y = index%2 == 0 ? (position.y + buffer + bigRadius) : (position.y - buffer - bigRadius);
        }else{
            planetPosition.x = index%2 == 0 ? (position.x - buffer - bigRadius) : (position.x + buffer + bigRadius);
            planetPosition.y = position.y;
        }
        return planetPosition;
    }

    /** returns modified start and endpoint of connection-path */
    const getPathPosition = (a,b)=>{
        var from = {}
        var to = {}
        if(direction == 'horizontal'){
            from.x = a.x + smallRadius/2
            from.y = a.y
            to.x = b.x - smallRadius/2
            to.y = b.y
        }else{
            from.x = a.x;
            from.y = a.y + smallRadius/2
            to.x = b.x;
            to.y = b.y - smallRadius/2
        }
        return {from,to}
    }

    /** draws paths connecting nodes */
    const drawPaths = (scope) =>{
        for(let i = 0; i < nodes.length-1; i++){
            const positions = getPathPosition(nodes[i].center,nodes[i+1].center)
            const path = new scope.Path.Line({
                from: positions.from,
                to: positions.to,
                strokeColor:{
                    gradient: {
                        stops: [[nodes[i].color,0.3], [nodes[i+1].color,0.8]]
                    },
                    origin: nodes[i].center,
                    destination: nodes[i+1].center
                },
                strokeWidth: 50 * scope.project.activeLayer.bounds.x /scope.view.size.width
            })
        }   
    }
    /** draws nodes and planet representation */
    const drawPlanets = (scope) =>{
        const view = scope.view
        var position = getInitalPosition(view);
        var i = 0;
        planets.forEach((p) => {
            // draw node point
            const outer = new scope.Path.Circle({
                center: position,
                radius: smallRadius,
                fillColor: p.color
            })
            const n = new scope.Path.Circle({
                center: position,
                radius: Math.max(smallRadius/2,0)
            })
            outer.subtract(n)
            nodes.push({center: {x: position.x,y: position.y},color: p.color});
            n.remove();
            outer.remove();
            // draw Planet graphics
            const pl = new scope.Path.Circle({
                center: getPlanetPosition(position,i),
                radius: bigRadius,
                fillColor: p.color
            })
            increasePosition(position)
            i++;
        });
    }
    /** takes paper js canvas scope object and calls relevant render methods */
    const render = (scope) => {
        //const back = new scope.Path.Rectangle(getBackgroundKoord(scope),getBackgroundSize());
        drawPlanets(scope);
        drawPaths(scope);        
        scope.view.update()
        scope.project.activeLayer.fitBounds(scope.view.bounds)
        nodes = [];

    }

    /** takes paper js canvas scope object and performs animations */
    const animate = (scope) => {
        scope.activate();
        scope.project.activeLayer.removeChildren();
        render(scope);
    }

    return (
        <div className={className}>
            <Canvas width={canvasSize.width} height={canvasSize.height} draw={render} animate={animate}/>
        </div>
    )
}

export default RouteHistoryPanel