import React, {useEffect,useRef,useState} from 'react'
import paper from 'paper';


// inspired by https://stackoverflow.com/a/76237061

/** Canvas using paper js, define width, height, backgroundcolor in tailwind, if its resizable and draw call*/
const Canvas = ({width,height,draw,animate}) =>{
    const scope = new paper.PaperScope();
    const ref = useRef(null);
    const [setup,setSetup] = useState(false);
    /** setup of paperjs canvas on initial frame */
    useEffect(()=>{
        const canvas = ref.current;

        if(setup){
            return;
        }
        scope.setup(canvas);
        setSetup(true);
        draw(scope);

        if(animate){
            scope.view.onFrame = (event) =>{
                animate(scope,event)
            }
        }

        scope.view.onResize = () =>{
            scope.project.activeLayer.fitBounds(scope.view.bounds);
        }
        
        scope.view.on()
        scope.view.draw();
        return () => {
            ref.current = null;
        }
    }, []);

    return (
        <div className={"flex items-center justify-center overflow-hidden h-full w-full"}>
            <canvas ref={ref} style={{width:'100%',height:'100%'}} width={width} height={height} resize='true'/>
        </div>)
}

export default Canvas;