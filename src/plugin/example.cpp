#include "example.h"

using namespace std;

int example::add(int x, int y)
{
    int *p = NULL;
    *p = 100;
    return (x + y);
}

Napi::Number example::addWrapped(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    // Check if arguments are integer only.
    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber())
    {
        Napi::TypeError::New(env, "arg1::Number, arg2::Number expected").ThrowAsJavaScriptException();
    }
    // Convert javascripts datatype to c++
    Napi::Number first = info[0].As<Napi::Number>();
    Napi::Number second = info[1].As<Napi::Number>();
    // Run c++ function return value and return it in javascript
    Napi::Number returnValue = Napi::Number::New(env, example::add(first.Int32Value(), second.Int32Value()));

    return returnValue;
}

Napi::Object example::Init(Napi::Env env, Napi::Object exports)
{
    // Export Napi function
    exports.Set("add", Napi::Function::New(env, example::addWrapped));
    return exports;
}