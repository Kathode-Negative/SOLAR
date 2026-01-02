import React, { useEffect, useState } from "react";
import Canvas from "./Canvas";


const RoutePanel = ({className, planets, addPlanet, setCurrentPlanet}) =>{

    const buffer = 70;
    const maxHeight = 400;
    const screenHeight = maxHeight*2 + 200;
    const textHeight = 20;
    const spacing = 80;
    const bigRadius = 90; 
    const selectionSpacing = 20;
    const animationTimeSecondsPath = 0.2;
    let pathAnimationTime = 0;
    let animationCounter = 0;
    let animationPaths = [];

    const animationTimeSecondsSelection = 1;
    let selectionAnimationTime = 0;
    let selection = null;
    
    const [ps, setPs] = useState([]);
    const [selectedPlanets, setSelectedPlanets] = useState([]);
    let cplanet = null;
    let removedPlanet = -1;
    const [addedPlanet, setAddedPlanet] = useState(null);
    let pathstoAnimate = [];
    
    

    /** returns inital position with offset */
    const getInitalPosition = (view) =>{
        const center = view.center;
        return {x:buffer + bigRadius ,y: center.y}        
    }

    /** increases position x by constants */
    const increasePosition = (position) =>{
        position.x = position.x + bigRadius * 2 + spacing;
        return {x:position.x, y:position.y}
    }

    /** returns size of background square */
    const getBackgroundSize = ()=>{
        const width = buffer*2 + (bigRadius * 2 + spacing)*planets.length - spacing;
        const height = (screenHeight + textHeight)
        return {width,height}
    }

    /** draws sun shape [deprecated] */
    const drawSun = (scope) =>{
        const position = getInitalPosition(scope.view)
        return new scope.Path.Circle({
            center: [-350,position.y],
            radius: 300,
            fillColor: '#f8c333'
        })
    }
    /** returns height factor dependent on distance */
    const heightFactor = (scope,distance) =>{
        const fac = distance / scope.project.activeLayer.bounds.width
        return fac;
    }

    /** returns middle point between two planets with vertical offset dependent on index */
    const getMiddlePoint = (index,a,b,scope) =>{
        const x = Math.abs(a[0] - b[0])/2 + Math.min(a[0],b[0]);
        const fac = Math.min(maxHeight,maxHeight * heightFactor(scope,Math.abs(a[0]-b[0]))* 2)
        if(index %2 == 0){
            var y = a[1] + fac;
        }else{
            var y = a[1] - fac;
        }
        return [x,y]
    }

    /** adds or removes planet p depending on if it is contained in selected planets or not */
    const handlePlanet = (p) =>{
        if(selectedPlanets.includes(p)){
            const index = selectedPlanets.indexOf(p)
            if(index !== -1){
                selectedPlanets.splice(index,1);
                removedPlanet = index;
                cplanet = selectedPlanets.at(-1);
            }else{
                removedPlanet = -1
                cplanet = p;
            }
        }else{
            selectedPlanets.push(p)
            cplanet = p;    
            removedPlanet = -1;
        }
    }
    /** calls all relevant methods to be performed if a planet p is clicked */
    const planetClick = (p,scope)=>{
        handlePlanet(p);
        render(scope);
        setCurrentPlanet(cplanet);
        addPlanet(p);
    }
    /** draws selection indictor around currently selected planet p at position */
    const drawSelection = (scope,position,p) =>{
        if(cplanet && cplanet.name == p.name){
            const sel = new scope.Path.Circle({
                center: position,
                radius: bigRadius + selectionSpacing,
                strokeColor: p.color,
                strokeWidth: 3,
                dashArray: [6,8],
                strokeCap: 'round'
            })
            sel.sendToBack();
            selection = sel;
        }else{
            selection = null;
        }
    }
    /** iterates over planets and draws each planet in scope. appends hover effects and onclick handler */
    const drawPlanets = (scope) => {
        let position = getInitalPosition(scope.view);
        planets.forEach(p => {
            const planet = new scope.Path.Circle({
                center: position,
                radius: bigRadius,
                fillColor: p.color,
                name: p.name,
                onMouseEnter: () => {
                    scope.view.element.style.setProperty('cursor', 'pointer');
                },
                onMouseLeave: () => {
                    scope.view.element.style.setProperty('cursor', null);
                },
                onClick: () =>{planetClick(p,scope);}
            })
            drawSelection(scope,position,p);
            ps[p.name] = {center:[position.x, position.y],color:p.color};
            increasePosition(position);
        });
    }
    /** draws arc from planet a to b in ps, orientation depending on index i, animates if animated = true */
    const drawPath = (scope,a,b,i,animated) =>{
        var i = i ? i : 0;
        const middle = new scope.Point(getMiddlePoint(i,ps[a].center,ps[b].center,scope))
        const from = new scope.Point(ps[a].center);
        const to = new scope.Point(ps[b].center);
        const path = new scope.Path.Arc({
            from: from,
            through: middle,
            to: to,
            strokeColor : {
                gradient: {
                    stops: [[ps[a].color,0.3], [ps[b].color,0.8]]
                },
                origin: ps[a].center,
                destination: ps[b].center
            },
            strokeWidth: animated ? 0 : 15
        });
        path.name = b;
        if(animated){
            pathstoAnimate.push(path);
        }
        path.sendToBack();
    }

    /** iteratively draws all paths in scope, end defines n+1 iterations 
     * to do over selectedPlanets, animate tells if all paths should be animated or not */
    const iteratePaths = (scope,end,animate)=>{
        for(let i = 0; i < end; i++){
            const a = selectedPlanets[i].name;
            const b = selectedPlanets[i+1].name;
            drawPath(scope,a,b,i,animate);
        }
    }

    /** decides which connecting paths to draw and animate */
    const drawPaths = (scope) =>{
        if(selectedPlanets.length > 1){
            if(removedPlanet == -1){
                iteratePaths(scope,selectedPlanets.length -2,false);
                const a = selectedPlanets[selectedPlanets.length -2].name;
                const b = selectedPlanets[selectedPlanets.length -1].name;
                drawPath(scope,a,b,selectedPlanets.length - 2,true);
            }else if (removedPlanet > selectedPlanets.length-1){
                iteratePaths(scope,selectedPlanets.length -1,false);
            }else{
                iteratePaths(scope,selectedPlanets.length -1,true); 
            }
        }
    }

    /** draws background square used for positioning */
    const drawBackground = (scope) =>{
        const back = new scope.Path.Rectangle([0,scope.view.center.y - screenHeight/2 + 50 ],getBackgroundSize());
    }

    /** draws names of planets at bottom of view */
    const drawText = (scope) =>{
        let position = getInitalPosition(scope.view);
        position.y = screenHeight - 300;
        planets.forEach(p =>{
            const label = new scope.PointText({
                position: position,
                justification: 'center',
                fillColor: p.color,
                content: p.name,
                fontSize: cplanet == p ? '60' : '50',
                /*onMouseEnter: () => {
                    scope.view.element.style.setProperty('cursor', 'pointer');
                },
                onMouseLeave: () => {
                    scope.view.element.style.setProperty('cursor', null);
                },
                onClick: () =>{planetClick(p,scope);}*/
            });
            increasePosition(position);
        })
    }

    //** resets animation constants */
    const resetAnimation = () =>{
        pathstoAnimate = [];
        animationPaths = [];
        animationCounter = 0;
        pathAnimationTime = 0;
    }
    /** updates paperjs view */
    const updateView = (scope) => {
        scope.view.update();
        scope.view.draw();
        scope.project.activeLayer.fitBounds(scope.view.bounds);
    }

    /** calls all relevant render methods for this component */
    const render = (scope) =>{
        //drawSun(scope);
        resetAnimation();
        scope.project.activeLayer.removeChildren();
        scope.activate();

        drawBackground(scope);
        drawPlanets(scope);
        drawPaths(scope);
        drawText(scope);

        updateView(scope);
    }

    /** performs all animations relevant for this component */
    const animate = (scope,event) =>{
        scope.activate();
        if(pathstoAnimate.length > 0){
            pathAnimationTime += event.delta
            const percent = pathAnimationTime / animationTimeSecondsPath;
            if (percent > 1){
                pathAnimationTime = 0;
                const p = pathstoAnimate[animationCounter];
                scope.project.activeLayer.addChild(p);
                p.strokeWidth = 15;
                p.sendToBack();
                animationCounter++;
                if(animationCounter >= pathstoAnimate.length){
                    animationCounter = 0;
                    pathstoAnimate.forEach(p => {        
                        scope.project.activeLayer.addChild(p);
                        p.strokeWidth = 15;
                        p.sendToBack();
                    });
                    animationPaths.forEach(path =>{
                        path.remove();
                    })
                    pathstoAnimate = [];
                    animationPaths = [];
                    return;
                }
            }else{
                const path = pathstoAnimate[animationCounter];
                const to = path.getLocationAt(path.length*percent).getPoint();
                const middle = path.getLocationAt(path.length*(percent/2)).getPoint();
                const from = path.getLocationAt(0).getPoint();
                const animpath = new scope.Path.Arc({
                    from: from,
                    to: to,
                    through: middle,
                    strokeColor: path.strokeColor,
                    strokeWidth: 15,
                    strokeCap: 'round'
                })
                animationPaths.push(animpath);
                animpath.sendToBack();
                scope.view.update();
            }
        }
    }

    const canvasSize = {width: 900, height:540};

    return (
        <div className={className}>
            <Canvas width={canvasSize.width} height={canvasSize.height} draw={render} animate={animate}/>
        </div>
    )
}

export default RoutePanel