include('\BaseHook.js')
class libCHook extends ModuleHook {
    constructor() {
        super('libc.so');
		this.hooks={};
		this.hooks['fopen'] = new FunctionHook('fopen');
		this.hooks['fread'] = new FunctionHook('fread');
    }	
	defaultOnLibLoad(self)
	{
		console.log(`${this.name} defaultOnLibLoad`);
	}	
}