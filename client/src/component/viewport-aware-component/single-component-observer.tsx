type IOCallback = () => void;

class SingleComponentObserver {

    protected observer: IntersectionObserver;
    protected callbackMap: Map<Element, IOCallback>;

    constructor(config: IntersectionObserverInit = {}) {
        this.callbackMap = new Map();
        this.observer = new IntersectionObserver(this.handleIntersections.bind(this), config);
    }

    protected handleIntersections(entries: Array<IntersectionObserverEntry>) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const callback = this.callbackMap.get(entry.target);
                callback && callback();
                this.observer.unobserve(entry.target);
                this.callbackMap.delete(entry.target);
            }
        })
    }

    public observe(ref: Element, callback: IOCallback) {
        if (this.callbackMap.get(ref)) {
            return;
        }

        this.callbackMap.set(ref, callback);
        this.observer.observe(ref);
    }

}

export default new SingleComponentObserver();