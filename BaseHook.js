class BaseHook
{
	constructor(name,rva)
	{
		this.name=name;
		this.rva=rva;
	}
}

class ModuleHook extends BaseHook {
    constructor(moduleName,onLibLoadFunction,baseAddr=null) {
        super(moduleName,baseAddr);
		this.onLibLoad = !onLibLoadFunction?this.defaultOnLibLoad:onLibLoadFunction;
    }
	Hook(){
		if(!this.rva)
		{
			this.rva=Module.findBaseAddress(this.name);
		}
		if(this.rva)
		{
			console.log(`Get module ${this.name} on ${this.rva}`);
			this.onLibLoad(this);
		}
		return this.rva;
	}
	
	defaultOnLibLoad(self)
	{
		console.log(`${this.name} defaultOnLibLoad`);
	}	
}

class FunctionHook extends BaseHook
{
	constructor(methodName,rva,enterFunction,leaveFunction)
	{
		super(methodName,rva);
		this.onEnter = !enterFunction?this.defaultOnEnter:enterFunction;
		this.onLeave = !leaveFunction?this.defaultOnLeave:leaveFunction;
		this.vitualAddr= null;
		this.Native= null;
	}
	
	HookByModule(module)
	{
		let va = module.rva.add(this.rva);
		return this.HookByVitualAddress(va);
	}
	
	HookByFunctionName(methodName)
	{
		if(methodName)
		{
			this.name=methdName;
		}
		let va = Module.getExportByName(null, this.name);
		return this.HookByVitualAddress(va);
	}
	
	HookByVitualAddress(vitualAddr)
	{
		if(vitualAddr)
		{
			this.vitualAddr=vitualAddr;
		}
		if(this.vitualAddr)
		{
			console.log(`Get function ${this.name} on ${this.vitualAddr}`);
			let self=this;
			Interceptor.attach(this.vitualAddr, {
				onEnter:function (args){
					self.onEnter(args);
				},
				onLeave:function (retval){
					self.onLeave(retval);
				}
			});
		}
		return this.vitualAddr;
	}
	
	SetNative(retval,callArgs)
	{
		this.Native = new NativeFunction(this.vitualAddr, retval, callArgs);
	}
	
	Invoke(args)
	{
		if(!this.Native)
		{
			console.log(`${this.name} not get native`);
			return null;
		}
		
		switch(args.length)
		{
			case 0:
			return this.Native();
			case 1:
			return this.Native(args[0]);
			case 2:
			return this.Native(args[0],args[1]);
			case 3:
			return this.Native(args[0],args[1],args[2]);
			case 4:
			return this.Native(args[0],args[1],args[2],args[3]);
			case 5:
			return this.Native(args[0],args[1],args[2],args[3],args[4]);
		}
	}
	
	defaultOnEnter(args)
	{
		console.log(`${this.name} Enter.`);
	}
	
	defaultOnLeave(retval)
	{
		console.log(`${this.name} Leave.`);
	}
}