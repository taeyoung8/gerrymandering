import threading as th

class ThreadWithReturn(th.Thread):
    def __init__(self, group=None, target=None, name=None,
                 args=(), kwargs={}, Verbose=None):
        th.Thread.__init__(self, group, target, name, args, kwargs)
        self._return = None
        self._is_collected = False

    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args,
                                                **self._kwargs)
            
    def is_collected(self):
        return self._is_collected

    def join(self, *args):
        th.Thread.join(self, *args)
        self._is_collected = True
        return self._return
    
    def minute_join(self):
        th.Thread.join(self, timeout=60.0)
        if th.Thread.is_alive(self):
            return None
        self._is_collected = True
        return self._return